import { Component, OnInit } from '@angular/core';
import { CentralService } from '../central.service';

import * as Parser from '../parser/formula-parser.js';
const parse = Parser.parse;
@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css'],
})
export class VisualizerComponent implements OnInit {
  // @Input('formula') formula: string = '';
  isValid: boolean = true;
  showVisualizer: boolean = false;
  syntaxTree: {};
  syntaxTreeJson: {};
  operations = [
    'ADDITION',
    'SUBTRACTION',
    'MULTIPLICATION',
    'DIVISION',
    'VARIABLE',
    'NUMBER',
    'SQRT',
    'SQR',
    'PI',
  ];

  constructor(private centralService: CentralService) {}
  ngOnInit() {
    this.centralService.renderVisualizer.subscribe((formula: string) => {
      this.showVisualizer = true;
      this.centralService.setSyntaxTree(formula);
      this.syntaxTree = this.centralService.getSyntaxTree();
      this.syntaxTreeJson = this.centralService.getSyntaxTreeJson();
    });
  }

  addNode(curr: any, parent: any, argInd: number) {
    //Add new node outside of selected node and bind them via addition operator
    let newNode = {
      type: 'ADDITION',
      left: curr,
      right: {
        type: 'NUMBER',
      },
    };
    // If parent node is addition
    if (
      parent.type == 'ADDITION' ||
      parent.type == 'SUBTRACTION' ||
      parent.type == 'MULTIPLICATION' ||
      parent.type == 'DIVISION'
    ) {
      let isLeft = curr === parent.left;
      isLeft ? (parent.left = newNode) : (parent.right = newNode);
    }
    //If no parent node
    else if (JSON.stringify(parent) === JSON.stringify({})) {
      let temp = Object.assign({}, curr);
      curr.type = 'ADDITION';
      curr.left = temp;
      curr.right = { type: 'NUMBER' };
      if (curr.name) {
        delete curr.name;
      }
      if (curr.valuue) {
        delete curr.value;
      }
    }
    //If parent node is FUNCTION
    else if (parent.type == 'FUNCTION') {
      parent.arguments[argInd] = newNode;
    }
    //If parent node is PAREN
    else if (parent.type == 'PAREN') {
      parent.expression = newNode;
    }
  }

  removeNode(curr: any, parent: any, argInd: any) {
    let newNode = {
      type: 'NUMBER',
    };
    if (
      parent.type == 'ADDITION' ||
      parent.type == 'SUBTRACTION' ||
      parent.type == 'MULTIPLICATION' ||
      parent.type == 'DIVISION'
    ) {
      if (parent.type == 'MULTIPLICATION' || parent.type == 'DIVISION') {
      }
      let isLeft = curr === parent.left;
      isLeft ? (parent.left = newNode) : (parent.right = newNode);
    } else if (JSON.stringify(parent) === JSON.stringify({})) {
      Object.keys(curr).forEach((key) => delete curr[key]);
      curr['type'] = 'NUMBER';
    } else if (parent.type == 'FUNCTION') {
      parent.arguments[argInd] = {
        type: 'NUMBER',
      };
    } else if (parent.type == 'PAREN') {
      parent.expression = newNode;
    }
  }

  changeOption(event: any, node: any) {
    //Change from NUMBER to ....
    if (node.type == 'NUMBER') {
      //to VARIABLE
      if (this.operations[event.target.selectedIndex] == 'VARIABLE') {
        this.centralService.changeToVariable(node);
        delete node.value;
      }
      //to PI
      else if (this.operations[event.target.selectedIndex] == 'PI') {
        this.centralService.changeToPI(node);
      }
      //to BINARY ARITHMATIC
      else if (
        this.operations[event.target.selectedIndex] == 'ADDITION' ||
        this.operations[event.target.selectedIndex] == 'SUBTRACTION' ||
        this.operations[event.target.selectedIndex] == 'MULTIPLICATION' ||
        this.operations[event.target.selectedIndex] == 'DIVISION'
      ) {
        let left = {
          type: 'NUMBER',
          value: node.value,
        };
        let right = {
          type: 'NUMBER',
        };
        this.centralService.changeToBinOp(
          node,
          this.operations[event.target.selectedIndex],
          left,
          right
        );
        delete node.value;
      }
      //to SQRT Or SQR
      else if (
        this.operations[event.target.selectedIndex] == 'SQRT' ||
        this.operations[event.target.selectedIndex] == 'SQR'
      ) {
        let args = [];
        args.push({
          type: 'NUMBER',
          value: node.value,
        });
        this.centralService.changeToFunction(
          node,
          this.operations[event.target.selectedIndex],
          args
        );
        delete node.value;
      }
    }

    //Change from VARIABLE to ....
    else if (node.type == 'VARIABLE') {
      //to NUMBER
      if (this.operations[event.target.selectedIndex] == 'NUMBER') {
        this.centralService.changeToNumber(node);
        delete node.name;
      }
      //to PI
      else if (this.operations[event.target.selectedIndex] == 'PI') {
        //console.log('Number to PI');
        this.centralService.changeToPI(node);
      }
      //to BINARY ARITHMATIC
      else if (
        this.operations[event.target.selectedIndex] == 'ADDITION' ||
        this.operations[event.target.selectedIndex] == 'SUBTRACTION' ||
        this.operations[event.target.selectedIndex] == 'MULTIPLICATION' ||
        this.operations[event.target.selectedIndex] == 'DIVISION'
      ) {
        let left = {
          type: 'VARIABLE',
          name: node.name,
        };
        let right = {
          type: 'NUMBER',
        };
        this.centralService.changeToBinOp(
          node,
          this.operations[event.target.selectedIndex],
          left,
          right
        );
        delete node.name;
      }
      //to SQRT or SQR
      else if (
        this.operations[event.target.selectedIndex] == 'SQRT' ||
        this.operations[event.target.selectedIndex] == 'SQR'
      ) {
        let args = [];
        args.push({ type: 'VARIABLE', name: node.name });
        this.centralService.changeToFunction(
          node,
          this.operations[event.target.selectedIndex],
          args
        );
      }
    }
    //Change from PI to ....
    else if (node.type == 'PI') {
      //to VARIABLE
      if (this.operations[event.target.selectedIndex] == 'VARIABLE') {
        this.centralService.changeToVariable(node);
        delete node.value;
      }
      //to NUMBER
      else if (this.operations[event.target.selectedIndex] == 'NUMBER') {
        this.centralService.changeToNumber(node, node.value);
      }
      //to BINARY ARITHMATIC
      else if (
        this.operations[event.target.selectedIndex] == 'ADDITION' ||
        this.operations[event.target.selectedIndex] == 'SUBTRACTION' ||
        this.operations[event.target.selectedIndex] == 'MULTIPLICATION' ||
        this.operations[event.target.selectedIndex] == 'DIVISION'
      ) {
        let left = {
          type: 'PI',
          value: node.value,
        };
        let right = {
          type: 'NUMBER',
        };
        this.centralService.changeToBinOp(
          node,
          this.operations[event.target.selectedIndex],
          left,
          right
        );
      }
      // to SQRT or SQR
      else if (
        this.operations[event.target.selectedIndex] == 'SQRT' ||
        this.operations[event.target.selectedIndex] == 'SQR'
      ) {
        let args = [];
        args.push({ type: 'PI', value: node.value });
        this.centralService.changeToFunction(
          node,
          this.operations[event.target.selectedIndex],
          args
        );
      }
    }
    // Change from BINARY ARITHMATIC to
    else if (
      node.type == 'ADDITION' ||
      node.type == 'SUBTRACTION' ||
      node.type == 'MULTIPLICATION' ||
      node.type == 'DIVISION'
    ) {
      //to BINARY ARITHMATIC
      if (
        this.operations[event.target.selectedIndex] == 'ADDITION' ||
        this.operations[event.target.selectedIndex] == 'SUBTRACTION' ||
        this.operations[event.target.selectedIndex] == 'MULTIPLICATION' ||
        this.operations[event.target.selectedIndex] == 'DIVISION'
      ) {
        node.type = this.operations[event.target.selectedIndex];
      }
      //to VARIABLE
      else if (this.operations[event.target.selectedIndex] == 'VARIABLE') {
        this.centralService.changeToVariable(node);
        delete node.left;
        delete node.right;
      }
      //to NUMBER
      else if (this.operations[event.target.selectedIndex] == 'NUMBER') {
        this.centralService.changeToNumber(node);
        delete node.left;
        delete node.right;
      }
      //to SQRT or SQR
      else if (
        this.operations[event.target.selectedIndex] == 'SQRT' ||
        this.operations[event.target.selectedIndex] == 'SQR'
      ) {
        let args = [];
        args.push({
          type: 'NUMBER',
        });
        this.centralService.changeToFunction(
          node,
          this.operations[event.target.selectedIndex],
          args
        );
        delete node.left;
        delete node.right;
      }
      //to PI
      else if (this.operations[event.target.selectedIndex] == 'PI') {
        this.centralService.changeToPI(node);
        delete node.left;
        delete node.right;
      }
    }
    //Change from FUNCTION to ....
    else if (
      node.type == 'FUNCTION' &&
      (node.name == 'SQRT' || node.name == 'SQR')
    ) {
      //to VARIABLE
      if (this.operations[event.target.selectedIndex] == 'VARIABLE') {
        this.centralService.changeToVariable(node);
        delete node.arguments;
      }
      //to NUMBER
      else if (this.operations[event.target.selectedIndex] == 'NUMBER') {
        this.centralService.changeToNumber(node);
        delete node.arguments;
        delete node.name;
      }
      //to PI
      else if (this.operations[event.target.selectedIndex] == 'PI') {
        this.centralService.changeToPI(node);
        delete node.arguments;
        delete node.name;
      }
      //to BINARY ARITHMATIC
      else if (
        this.operations[event.target.selectedIndex] == 'ADDITION' ||
        this.operations[event.target.selectedIndex] == 'SUBTRACTION' ||
        this.operations[event.target.selectedIndex] == 'MULTIPLICATION' ||
        this.operations[event.target.selectedIndex] == 'DIVISION'
      ) {
        let left = node.arguments[0];
        let right = {
          type: 'NUMBER',
        };
        this.centralService.changeToBinOp(
          node,
          this.operations[event.target.selectedIndex],
          left,
          right
        );
        delete node.arguments;
        delete node.name;
      }
      //to SQRT or SQR
      else if (
        this.operations[event.target.selectedIndex] == 'SQRT' ||
        this.operations[event.target.selectedIndex] == 'SQR'
      ) {
        node.name = this.operations[event.target.selectedIndex];
      }
    }
  }

  onInputChange(event: any, node) {
    if (event.target.name == 'varVal') {
      node.name = event.target.value;
    } else if (event.target.name == 'numVal') {
      // if (isNaN(event.target.value) == true) {
      //   node.value = event.target.value;
      // }
      node.value = event.target.value;
    }
  }

  astToFormula() {
    this.centralService.toFormula.emit(this.syntaxTree);
  }
}
