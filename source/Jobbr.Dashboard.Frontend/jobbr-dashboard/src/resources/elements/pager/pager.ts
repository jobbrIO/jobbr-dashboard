import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { isNumber } from "util";
import { PagedResult } from "../../api/paged-result";

@autoinject()
export class Pager {

  @bindable public pagedResult: PagedResult<any>;
  @bindable public changePage: any;

  private pages: Array<number> = [];
  private lastPage: number;

  constructor(
    private element: Element
    ) {
  }

  pagedResultChanged(newValue: PagedResult<any>) {
    let startNumber = newValue.page - 5;
    let endNumber = newValue.page + 5;

    let newPages = [];
    
    for(let i = startNumber; i <= endNumber; ++i) {
      if (i < 1) {
        continue;
      }

      if (newValue.pageSize * i > newValue.totalItems) {
        break;
      }

      newPages.push(i);
    }

    this.pages = newPages;

    if (this.pages.length > 0) {
      this.lastPage = newPages[newPages.length - 1];
    } else {
      this.lastPage = 1;
    }
  }

  private selectPage(page: number) {
    if (this.changePage) {
      this.changePage({ page: page });
    }
  }

  private next() {
    if (this.pagedResult.page < this.lastPage) {
      this.selectPage(this.pagedResult.page + 1);
    }
  }

  private previous() {
    if (this.pagedResult.page > 1) {
      this.selectPage(this.pagedResult.page - 1);
    }
  }
}
