import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormulaComponent } from './formula/formula.component';
import { CentralService } from './central.service';
import { HeaderComponent } from './header/header.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { ToFormulaComponent } from './to-formula/to-formula.component';
@NgModule({
  declarations: [
    AppComponent,
    FormulaComponent,
    HeaderComponent,
    VisualizerComponent,
    ToFormulaComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [CentralService],
  bootstrap: [AppComponent],
})
export class AppModule {}
