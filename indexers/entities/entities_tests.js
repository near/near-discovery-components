import getBlock from './entities.js';
import testBlock from './test_block.js';

describe('entities.js indexer', () => {

    it('accepts data with an empty namespace', () => {
        getBlock(testBlock);
        // successful if it does not throw an error
    });
});