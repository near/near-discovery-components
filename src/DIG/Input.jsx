let {
  assistiveText,
  disabled,
  iconLeft,
  iconRight,
  inputNodeLeft,
  inputNodeRight,
  invalid,
  label,
  search,
  select,
  textarea,
  valid,
  value,
  ...forwardedProps
} = props;

const hasNoValue = !value;

const Wrapper = styled.label`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;

  &[data-disabled="true"] {
    pointer-events: none;
  }
`;

const Label = styled.span`
  display: block;
  font: var(--text-xs);
  font-weight: 600;
  color: var(--sand12);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  column-gap: 10px;
  position: relative;
  border-radius: 6px;
  border: 1px solid var(--sand6);
  background: var(--sand1);
  transition: background-color 200ms, border-color 200ms, color 200ms, box-shadow 200ms;
  flex-wrap: wrap;

  i {
    font-size: 16px;
    color: var(--sand10);
    transition: all 200ms;
    pointer-events: none;
  }

  &:hover {
    border-color: var(--sand7);
    background: var(--sand2);
  }

  [data-search="true"] & {
    border-radius: 100px;
  }

  [data-invalid="true"] & {
    background: var(--red1);
    border-color: var(--red9);
    i {
      color: var(--red9);
    }
    input {
      color: var(--red12);
    }
    &:hover {
      background: var(--red2);
      border-color: var(--red8);
    }
  }

  [data-valid="true"] & {
    background: var(--green1);
    border-color: var(--green9);
    i {
      color: var(--green8);
    }
    input {
      color: var(--green12);
    }
    &:hover {
      background: var(--green2);
      border-color: var(--green8);
    }
  }

  [data-textarea="true"] & {
    padding: 0;
    overflow: hidden;
  }

  [data-select="true"] & {
    padding: 0;

    input {
      padding: 0 40px 0 12px;
    }

    i {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      line-height: 40px;
      padding: 0 12px;
    }
  }

  [data-no-value="true"][data-select="true"] & {
    input {
      color: var(--sand10);
    }
  }

  [data-disabled="true"] & {
    pointer-events: none;
    background: var(--sand3);
    border-color: var(--sand3);
    i {
      color: var(--sand8);
    }
  }

  &:focus-within {
    outline: none;
    border-color: var(--violet8) !important;
    background: var(--white) !important;
    box-shadow: 0 0 0 4px var(--violet4);
    i {
      color: var(--violet7);
    }
    input {
      color: var(--violet12);
    }
  }
`;

const Input = styled.input`
  display: block;
  flex-grow: 1;
  border: none;
  background: none;
  margin: 0;
  min-width: 150px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  color: var(--sand12);
  font: var(--text-base);
  outline: none !important;
  text-align: left;
  transition: color 200ms, opacity 200ms;

  [data-textarea="true"] & {
    line-height: 1.5;
    padding: 8px 12px;
    height: unset;
    min-height: 5.5rem;
  }

  &::placeholder {
    color: var(--sand10);
    font: var(--text-base);
    opacity: 1;
  }

  [data-disabled="true"] & {
    opacity: 1;
    color: var(--sand9);

    &::placeholder {
      color: var(--sand9);
    }
  }
`;

const AssistiveText = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font: var(--text-xs);
  color: var(--sand11);
  padding-top: 1px;
  transition: all 200ms;

  i {
    font-size: 14px;
  }

  [data-invalid="true"] & {
    color: var(--red11);
    i {
      color: var(--red8);
    }
  }

  [data-valid="true"] & {
    color: var(--green11);
    i {
      color: var(--green8);
    }
  }
`;

return (
  <Wrapper
    data-invalid={invalid}
    data-valid={valid}
    data-disabled={disabled}
    data-textarea={textarea}
    data-search={search}
    data-select={select}
    data-no-value={hasNoValue}
  >
    {label && <Label>{label}</Label>}

    <InputWrapper>
      {textarea ? (
        <Input
          as="textarea"
          disabled={disabled}
          aria-invalid={invalid === true}
          ref="forwardedRef"
          value={value}
          {...forwardedProps}
        />
      ) : (
        <>
          {iconLeft && <i className={iconLeft} />}

          {inputNodeLeft}

          <Input
            disabled={disabled}
            aria-invalid={invalid === true}
            ref="forwardedRef"
            value={value ?? (select ? forwardedProps.placeholder : undefined)}
            tabIndex={disabled ? -1 : forwardedProps.tabIndex}
            {...forwardedProps}
          />

          {inputNodeRight}

          {iconRight && <i className={iconRight} />}
        </>
      )}
    </InputWrapper>

    {assistiveText && (
      <AssistiveText>
        {valid && <i className="ph-bold ph-check-circle" />}
        {invalid && <i className="ph-bold ph-warning-circle" />}
        {assistiveText}
      </AssistiveText>
    )}
  </Wrapper>
);
