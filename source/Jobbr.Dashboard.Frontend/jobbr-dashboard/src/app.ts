import { autoinject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

@autoinject
export class App {

  constructor(private router: Router) {

  }
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.options.pushState = true;

    this.router = router;

    config.map([
      { route: ['', 'dashboard'], name: 'dashboard', moduleId: PLATFORM.moduleName('dashboard/dashboard'), title: 'Dashboard' },
      { route: ['queue'], name: 'queue', moduleId: PLATFORM.moduleName('queue/queue'), title: 'Queue' },
      { route: ['jobs'], name: 'jobs', moduleId: PLATFORM.moduleName('jobs/jobs'), title: 'Jobs' },
      { route: ['settings'], name: 'settings', moduleId: PLATFORM.moduleName('settings/settings'), title: 'Settings' },
    ]);
  }

  activate() {
    // this.validation.addRenderer(new BootstrapFormRenderer());
  }
}
