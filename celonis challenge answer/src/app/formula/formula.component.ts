import { Component, OnInit } from '@angular/core';
import { CentralService } from '../central.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css'],
})
export class FormulaComponent {
  formula: string = '($b + SQRT (SQR($b) - 4 * $a)) / (2 * $a)';
  constructor(private centralService: CentralService) {}

  updateAstView() {
    this.centralService.renderVisualizer.emit(this.formula);
  }
}
