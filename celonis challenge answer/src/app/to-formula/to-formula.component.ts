import { Component, OnInit } from '@angular/core';
import { CentralService } from '../central.service';

@Component({
  selector: 'app-to-formula',
  templateUrl: './to-formula.component.html',
  styleUrls: ['./to-formula.component.css'],
})
export class ToFormulaComponent implements OnInit {
  constructor(private centralService: CentralService) {}
  visualizerOutput = '';
  syntaxTree = {};
  showFormula: boolean = false;
  ngOnInit() {
    this.centralService.toFormula.subscribe((syntaxTree: {}) => {
      this.showFormula = true;
      this.syntaxTree = syntaxTree;
      this.astToFormula();
    });
  }
  astToFormula() {
    this.checkValidity();
    this.visualizerOutput = '';
    this.inOrderTraversal(this.syntaxTree);
  }
  checkValidity() {
    let inputElements = document.getElementsByTagName('input');
    for (let i = 0; i < inputElements.length; i++) {
      // console.log(inputElements[i], );
      if (inputElements[i].value == '') {
        alert('Enter all input fields');
        break;
      }
    }
  }
  inOrderTraversal(curr: any) {
    if (JSON.stringify(curr) === JSON.stringify({}) || curr === undefined) {
      return;
    }
    if (
      curr.type == 'ADDITION' ||
      curr.type == 'SUBTRACTION' ||
      curr.type == 'MULTIPLICATION' ||
      curr.type == 'DIVISION'
    ) {
      this.visualizerOutput += '(';
      this.inOrderTraversal(curr.left);
      if (curr.type == 'ADDITION') this.visualizerOutput += ' + ';
      else if (curr.type == 'SUBTRACTION') this.visualizerOutput += ' - ';
      else if (curr.type == 'MULTIPLICATION') this.visualizerOutput += ' * ';
      else if (curr.type == 'DIVISION') this.visualizerOutput += ' / ';
      this.inOrderTraversal(curr.right);
      this.visualizerOutput += ')';
    } else if (curr.type == 'FUNCTION') {
      let inclParen = true;
      if (
        curr.arguments[0].type == 'ADDITION' ||
        curr.arguments[0].type == 'SUBTRACTION' ||
        curr.arguments[0].type == 'MULTIPLICATION' ||
        curr.arguments[0].type == 'DIVISION'
      ) {
        inclParen = false;
      }
      if (inclParen) this.visualizerOutput += curr.name + '(';
      if (!inclParen) this.visualizerOutput += curr.name;
      this.inOrderTraversal(curr.arguments[0]);
      if (inclParen) this.visualizerOutput += ')';
    } else if (curr.type == 'PAREN') {
      this.inOrderTraversal(curr.expression);
    } else if (curr.type == 'VARIABLE') {
      this.visualizerOutput += curr.name;
    } else if (curr.type == 'NUMBER') {
      this.visualizerOutput += curr.value;
    } else if (curr.type == 'PI') {
      this.visualizerOutput += curr.type;
    }
  }
}
