# Notes

1. 4th package result in [`example output`](../resources/example_output) was incorrectly given. The algorithm returns `6,9` instead of `8,9` which you can also see from manually calculating.
2. 5th package details have been added for thorough testing purposes.
3. Overall, unit testing is almost perfect and complete except the lack for very explicit testing to catch the exceptions thrown by `load` and `save` methods of the [`Storage`](./src/storage.ts) class due to the lack of time.
4. [`eslint`](https://www.npmjs.com/package/eslint) has been used for linting and [`node-tap`](https://www.npmjs.com/package/tap) has been used for unit testing.
5. **TO BE DONE** Add ery explicit unit testing to catch the exceptions thrown by `load` and `save` methods of the [`Storage`](./src/storage.ts) class.
