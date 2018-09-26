import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject()
export class App {

  public router: Router;

  constructor() {
  }

  configureRouter(config: RouterConfiguration, router: Router): void {

    config.options.pushState = true;

    config.map([
      // nav routes
      { route: ['', 'dashboard'], name: 'dashboard', moduleId: PLATFORM.moduleName('dashboard/dashboard'), title: 'Dashboard', nav: true, settings: { icon: 'fas fa-tachometer-alt' } },
      { route: ['jobs'], name: 'jobs', moduleId: PLATFORM.moduleName('jobs/jobs'), title: 'Jobs', nav: true, settings: { icon: 'far fa-calendar-alt' } },
      { route: ['runs'], name: 'runs', moduleId: PLATFORM.moduleName('runs/runs'), title: 'Runs', nav: true, settings: { icon: 'fas fa-flag-checkered' } },
      { route: ['settings'], name: 'settings', moduleId: PLATFORM.moduleName('settings/settings'), title: 'Settings', nav: true, settings: { icon: 'fas fa-cog' } },

      // other routes
      { route: ['jobs/:jobId/runs'], name: 'runs', moduleId: PLATFORM.moduleName('runs/runs'), title: 'Runs' },
      { route: ['runs/:id'], name: 'rundetail', moduleId: PLATFORM.moduleName('rundetail/rundetail'), title: 'Run Detail' },
    ]);
    
    this.router = router;
  }

  activate() {
    // this.validation.addRenderer(new BootstrapFormRenderer());
  }
}
