import { Block } from "@near-lake/primitives";
/**
 * Note: We only support javascript at the moment. We will support Rust, Typescript in a further release.
 */

/**
 * getBlock(block, context) applies your custom logic to a Block on Near and commits the data to a database.
 * context is a global variable that contains helper methods.
 * context.db is a subfield which contains helper methods to interact with your database.
 *
 * Learn more about indexers here:  https://docs.near.org/concepts/advanced/indexers
 *
 * @param {block} Block - A Near Protocol Block
 */
async function getBlock(block: Block) {
  // =============================
  // Begin inclusion of diff library: https://github.com/kpdecker/jsdiff
  // =============================

  function Diff() {}

  Diff.prototype = {
    diff(oldString, newString, options = {}) {
      let callback = options.callback;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      this.options = options;

      let self = this;

      function done(value) {
        if (callback) {
          setTimeout(function () {
            callback(undefined, value);
          }, 0);
          return true;
        } else {
          return value;
        }
      }

      // Allow subclasses to massage the input prior to running
      oldString = this.castInput(oldString);
      newString = this.castInput(newString);

      oldString = this.removeEmpty(this.tokenize(oldString));
      newString = this.removeEmpty(this.tokenize(newString));

      let newLen = newString.length,
        oldLen = oldString.length;
      let editLength = 1;
      let maxEditLength = newLen + oldLen;
      if (options.maxEditLength) {
        maxEditLength = Math.min(maxEditLength, options.maxEditLength);
      }

      let bestPath = [{ newPos: -1, components: [] }];

      // Seed editLength = 0, i.e. the content starts with the same values
      let oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
        // Identity per the equality and tokenizer
        return done([{ value: this.join(newString), count: newString.length }]);
      }

      // Main worker method. checks all permutations of a given edit length for acceptance.
      function execEditLength() {
        for (let diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
          let basePath;
          let addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
          if (addPath) {
            // No one else is going to attempt to use this value, clear it
            bestPath[diagonalPath - 1] = undefined;
          }

          let canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
          if (!canAdd && !canRemove) {
            // If this path is a terminal then prune
            bestPath[diagonalPath] = undefined;
            continue;
          }

          // Select the diagonal that we want to branch from. We select the prior
          // path whose position in the new string is the farthest from the origin
          // and does not pass the bounds of the diff graph
          if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
            basePath = clonePath(removePath);
            self.pushComponent(basePath.components, undefined, true);
          } else {
            basePath = addPath; // No need to clone, we've pulled it from the list
            basePath.newPos++;
            self.pushComponent(basePath.components, true, undefined);
          }

          oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

          // If we have hit the end of both strings, then we are done
          if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
          } else {
            // Otherwise track this path as a potential candidate and continue.
            bestPath[diagonalPath] = basePath;
          }
        }

        editLength++;
      }

      // Performs the length of edit iteration. Is a bit fugly as this has to support the
      // sync and async mode which is never fun. Loops over execEditLength until a value
      // is produced, or until the edit length exceeds options.maxEditLength (if given),
      // in which case it will return undefined.
      if (callback) {
        (function exec() {
          setTimeout(function () {
            if (editLength > maxEditLength) {
              return callback();
            }

            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength) {
          let ret = execEditLength();
          if (ret) {
            return ret;
          }
        }
      }
    },

    pushComponent(components, added, removed) {
      let last = components[components.length - 1];
      if (last && last.added === added && last.removed === removed) {
        // We need to clone here as the component clone operation is just
        // as shallow array clone
        components[components.length - 1] = {
          count: last.count + 1,
          added: added,
          removed: removed,
        };
      } else {
        components.push({ count: 1, added: added, removed: removed });
      }
    },
    extractCommon(basePath, newString, oldString, diagonalPath) {
      let newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
        newPos++;
        oldPos++;
        commonCount++;
      }

      if (commonCount) {
        basePath.components.push({ count: commonCount });
      }

      basePath.newPos = newPos;
      return oldPos;
    },

    equals(left, right) {
      if (this.options.comparator) {
        return this.options.comparator(left, right);
      } else {
        return left === right || (this.options.ignoreCase && left.toLowerCase() === right.toLowerCase());
      }
    },
    removeEmpty(array) {
      let ret = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }
      return ret;
    },
    castInput(value) {
      return value;
    },
    tokenize(value) {
      return value.split("");
    },
    join(chars) {
      return chars.join("");
    },
  };

  function buildValues(diff, components, newString, oldString, useLongestToken) {
    let componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

    for (; componentPos < componentLen; componentPos++) {
      let component = components[componentPos];
      if (!component.removed) {
        if (!component.added && useLongestToken) {
          let value = newString.slice(newPos, newPos + component.count);
          value = value.map(function (value, i) {
            let oldValue = oldString[oldPos + i];
            return oldValue.length > value.length ? oldValue : value;
          });

          component.value = diff.join(value);
        } else {
          component.value = diff.join(newString.slice(newPos, newPos + component.count));
        }
        newPos += component.count;

        // Common case
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
        oldPos += component.count;

        // Reverse add and remove so removes are output first to match common convention
        // The diffing algorithm is tied to add then remove output and this is the simplest
        // route to get the desired output with minimal overhead.
        if (componentPos && components[componentPos - 1].added) {
          let tmp = components[componentPos - 1];
          components[componentPos - 1] = components[componentPos];
          components[componentPos] = tmp;
        }
      }
    }

    // Special case handle for when one terminal is ignored (i.e. whitespace).
    // For this case we merge the terminal into the prior string and drop the change.
    // This is only available for string mode.
    let lastComponent = components[componentLen - 1];
    if (
      componentLen > 1 &&
      typeof lastComponent.value === "string" &&
      (lastComponent.added || lastComponent.removed) &&
      diff.equals("", lastComponent.value)
    ) {
      components[componentLen - 2].value += lastComponent.value;
      components.pop();
    }

    return components;
  }

  function clonePath(path) {
    return { newPos: path.newPos, components: path.components.slice(0) };
  }

  const lineDiff = new Diff();
  lineDiff.tokenize = function (value) {
    let retLines = [],
      linesAndNewlines = value.split(new RegExp("(\n|\r)"));

    // Ignore the final empty token that occurs if the string ends with a new line
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    }

    // Merge the content and line separators into single tokens
    for (let i = 0; i < linesAndNewlines.length; i++) {
      let line = linesAndNewlines[i];

      if (i % 2 && !this.options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        if (this.options.ignoreWhitespace) {
          line = line.trim();
        }
        retLines.push(line);
      }
    }

    return retLines;
  };

  // =============================
  // End inclusion of diff library
  // =============================

  function base64decode(encodedValue) {
    let buff = Buffer.from(encodedValue, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }

  const SOCIAL_DB = "social.near";

  const componentUpdateTransactions = block
    .actions()
    .filter((action) => action.receiverId === SOCIAL_DB)
    .flatMap((action) =>
      action.operations
        .map((operation) => operation["FunctionCall"])
        .filter((operation) => operation?.methodName === "set")
        .map((functionCallOperation) => ({
          ...functionCallOperation,
          args: base64decode(functionCallOperation.args),
          receiptId: action.receiptId,
        }))
        .filter((functionCall) => {
          const accountId = Object.keys(functionCall.args.data)[0];
          return Object.keys(functionCall.args.data[accountId]).includes("widget");
        }),
    );

  if (componentUpdateTransactions.length > 0) {
    console.log("Found component development activity...");

    const blockHeight = block.header().height;
    const blockTimestampMs = Math.floor(Number(block.header().timestampNanosec) / 1e6);

    /*
          In the rare case that the same component was updated more than once in the same block,
          we'll run through the transactions sequentially. This assumes that "componentUpdateTransactions"
          matches the order in which the end users executed those actions on the blockchain.
        */

    for (const transaction of componentUpdateTransactions) {
      try {
        const receiptId = transaction.receiptId;
        const componentAuthorId = Object.keys(transaction.args.data)[0];
        const rawComponentData = transaction.args.data[componentAuthorId]["widget"] || {};
        const componentName = Object.keys(rawComponentData)[0];

        if (!componentName) {
          console.log("Skipping development activity due to missing component name", transaction.args.data);
          continue;
        }

        const componentData = rawComponentData[componentName];
        const code = componentData[""] || "";
        let previousCode = "";
        let linesAdded = 0;
        let linesRemoved = 0;

        const rawGraphqlResponse = await context.graphql(
          `query PreviousVersionQuery($componentAuthorId: String, $componentName: String) {
                        dataplatform_near_components_versions(
                            limit: 1
                            where: {component_author_id: {_eq: $componentAuthorId}, component_name: {_eq: $componentName}}
                            order_by: {id: desc}
                        ) {
                            id
                            code
                        }
                    }
                    `,
          {
            componentAuthorId,
            componentName,
          },
        );

        const previousVersions = rawGraphqlResponse?.dataplatform_near_components_versions ?? [];

        if (previousVersions[0]) {
          console.log(
            `Found previous version for: componentAuthorId=${componentAuthorId}, componentName=${componentName}`,
          );
          previousCode = previousVersions[0].code || "";
        } else {
          console.log(
            `Did not find previous version for: componentAuthorId=${componentAuthorId}, componentName=${componentName}`,
          );
        }

        const diff = lineDiff.diff(previousCode, code, {
          ignoreWhitespace: true,
        });

        diff.forEach((result) => {
          if (result.added) linesAdded += result.count;
          if (result.removed) linesRemoved += result.count;
        });

        const version = {
          block_height: blockHeight,
          block_timestamp_ms: blockTimestampMs,
          code,
          component_author_id: componentAuthorId,
          component_name: componentName,
          lines_added: linesAdded,
          lines_removed: linesRemoved,
          receipt_id: receiptId,
        };

        console.log(
          `Attempting to insert component version record for: componentAuthorId=${componentAuthorId}, componentName=${componentName}`,
        );

        await context.db.Versions.upsert(
          version,
          ["receipt_id"],
          [
            "block_height",
            "block_timestamp_ms",
            "code",
            "component_author_id",
            "component_name",
            "lines_added",
            "lines_removed",
          ],
        );

        console.log(
          `Successfully inserted component version record for: componentAuthorId=${componentAuthorId}, componentName=${componentName}`,
        );
      } catch (err) {
        console.log(`Error processing component version receipt at blockHeight=${blockHeight}: ${err}`);
        throw err;
      }
    }
  }
}
