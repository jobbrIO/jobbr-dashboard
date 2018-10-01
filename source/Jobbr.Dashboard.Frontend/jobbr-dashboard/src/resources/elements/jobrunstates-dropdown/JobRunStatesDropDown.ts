import { autoinject, containerless, bindable, observable, computedFrom, bindingMode } from "aurelia-framework";

@autoinject()
@containerless()
export class JobRunStatesDropDown {

  private text: string;
  private anythingSelected: boolean = false;

  private states = [
    { name: 'Scheduled', active: false }, 
    { name: 'Preparing', active: false },
    { name: 'Starting', active: false },
    { name: 'Started', active: false },
    { name: 'Connected', active: false },
    { name: 'Initializing', active: false },
    { name: 'Processing', active: false },
    { name: 'Finishing', active: false },
    { name: 'Collecting', active: false },
    { name: 'Completed', active: false },
    { name: 'Failed', active: false },
    { name: 'Deleted', active: false },
    { name: 'Omitted', active: false }
  ];
  
  @bindable({defaultBindingMode: bindingMode.twoWay})
  private selected = [];

  constructor(
  ) {
    this.updateSelected();
  }

  private clickState(state: any) {
    state.active = !state.active;

    this.updateSelected();
  }

  private updateSelected() {
    this.selected = this.states.filter(p => p.active).map(m => m.name);

    if (this.selected.length == 0) {
      this.text = 'All states';
      this.anythingSelected = false;
    } else {
      this.text = this.selected.join(', ');
      this.anythingSelected = true;
    }
  }

  private clearSelection() {
    this.states.forEach(e => e.active = false);
    this.updateSelected();
  }
}
