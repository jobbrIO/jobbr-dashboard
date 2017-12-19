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
      { route: ['jobs'], name: 'jobs', moduleId: PLATFORM.moduleName('jobs/jobs'), title: 'Jobs' },
      { route: ['queue'], name: 'queue', moduleId: PLATFORM.moduleName('queue/queue'), title: 'Queue' },
      { route: ['jobs/:jobId/runs', 'runs'], name: 'runs', moduleId: PLATFORM.moduleName('runs/runs'), title: 'Runs' },
      { route: ['jobs/:jobId/runs'], name: 'runs-from-job', moduleId: PLATFORM.moduleName('runs/runs'), title: 'Runs' },
      { route: ['runs/:id'], name: 'rundetail', moduleId: PLATFORM.moduleName('rundetail/rundetail'), title: 'Run Detail' },
      { route: ['settings'], name: 'settings', moduleId: PLATFORM.moduleName('settings/settings'), title: 'Settings' },
    ]);
  }

  activate() {
    // this.validation.addRenderer(new BootstrapFormRenderer());
  }
}
