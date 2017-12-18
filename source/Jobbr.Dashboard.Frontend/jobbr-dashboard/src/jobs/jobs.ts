import { autoinject } from 'aurelia-dependency-injection';

@autoinject
export class Jobs {
  public jobs;

  constructor() {
    this.jobs = [
      {
        "id": 1,
        "uniqueName": "MinutelyJob",
        "type": "Sample.Jobbr.Server.MinutelyJob",
        "parameters": {
          "Foo": "Bar",
          "Nested": {
            "Priority": "High",
            "Comment": "Heyho!"
          }
        },
        "trigger": [
          {
            "triggerType": "Recurring",
            "id": 1,
            "isActive": true,
            "parameters": {
              "Foo": "Bar",
              "Nested": {
                "Priority": "High",
                "Comment": "Heyho!"
              }
            }
          }
        ]
      },
      {
        "id": 2,
        "uniqueName": "HourlyJob",
        "type": "Sample.Jobbr.Server.HourlyJob",
        "parameters": {
          "Foo": "Bar"
        },
        "trigger": [
          {
            "triggerType": "Recurring",
            "id": 1,
            "isActive": true,
            "parameters": {
              "Foo": "Bar",
              "Nested": {
                "Priority": "High",
                "Comment": "Heyho!"
              }
            }
          }
        ]
      }
    ];
  }
}
