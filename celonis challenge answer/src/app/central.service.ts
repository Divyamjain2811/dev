import { EventEmitter } from '@angular/core';
import * as Parser from './parser/formula-parser.js';
const parse = Parser.parse;
export class CentralService {
  formula = '';
  syntaxTree: {};
  syntaxTreeJson: {};
  renderVisualizer = new EventEmitter<string>();
  toFormula = new EventEmitter<{}>();

  setSyntaxTree(formula: string) {
    this.formula = formula;
    new Promise(() => {
      this.syntaxTree = parse(formula);
    }).then(
      function () {
        this.syntaxTreeJson = JSON.stringify(this.syntaxTree, null, 2);
      },
      function () {
        alert(
          'This app supports only +,-,/,*,SQRT,SQR operations. Also make sure to write balanced formula'
        );
      }
    );
  }
  setSyntaxTreeValue(tree: {}) {
    this.syntaxTree = tree;
    this.syntaxTreeJson = JSON.stringify(this.syntaxTree, null, 2);
  }
  getSyntaxTree() {
    return this.syntaxTree;
  }
  getSyntaxTreeJson() {
    return this.syntaxTreeJson;
  }
  changeToBinOp(node, opName, left, right) {
    node.type = opName;
    node.left = left;
    node.right = right;
  }

  changeToNumber(node: any, value) {
    node.type = 'NUMBER';
    node.value = value;
  }

  changeToVariable(node) {
    node.type = 'VARIABLE';
    node['name'] = '';
  }

  changeToPI(node) {
    node.type = 'PI';
    node.value = 3.14;
  }

  changeToFunction(node, funName, args) {
    node.type = 'FUNCTION';
    node.name = funName;
    node.arguments = args;
  }
}
