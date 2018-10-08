import { autoinject, bindable } from "aurelia-framework";
import { PagedResult } from "../../api/paged-result";

@autoinject()
export class Pager {

  @bindable public pagedResult: PagedResult<any>;
  @bindable public changePage: any;

  private pages: Array<number> = [];
  private lastPage: number;

  constructor() {
  }

  pagedResultChanged(newValue: PagedResult<any>) {
    let startNumber = newValue.page - 5;
    let endNumber = newValue.page + 5;

    let newPages = [];

    this.lastPage = Math.ceil(newValue.totalItems / newValue.pageSize)
    
    for(let i = startNumber; i <= endNumber; ++i) {
      if (i < 1) {
        continue;
      }

      if (i > this.lastPage) {
        break;
      }

      newPages.push(i);
    }

    this.pages = newPages;
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
