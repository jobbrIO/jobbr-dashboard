import React from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import HeaderRow from "../components/header-row";
import DiskInfo from "../components/disk-info";
import RunInfo from "../components/run-info";
import utilStyles from "../styles/utils.module.scss";
import { getLastFiveFailedJobRuns, getScheduledAndRunningJobs } from "../lib/jobs";
import { getDisks } from "../lib/system";
import DateTime from "../components/date-time";
import State from "../components/state";

export async function getStaticProps() {
  const scheduledAndRunningJobs = await getScheduledAndRunningJobs();
  const availableDisks = await getDisks();
  const failedJobRuns = await getLastFiveFailedJobRuns();
  return {
    props: {
      scheduledAndRunningJobs,
      availableDisks,
      failedJobRuns,
    },
  };
}

export default function Dashboard({ scheduledAndRunningJobs, availableDisks, failedJobRuns }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <HeaderRow icon="microchip" title="CPU / Memory" />
        <div className="row">
          <div className="col-sm-12">TBD</div>
        </div>
      </section>
      <section>
        <HeaderRow icon="circle-notch" title="Scheduled & Running Jobs" rowClasses="mt-4" iconClasses="fa-spin" />
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">State</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Planned Start</th>
                  <th scope="col">Actual Start</th>
                </tr>
              </thead>
              <tbody>
                {scheduledAndRunningJobs.items.map(({ jobRunId, jobName, state, plannedStartUtc, actualStartUtc }) => (
                  <tr className={utilStyles.listItem} key={jobRunId}>
                    <td>{jobRunId}</td>
                    <td>
                      <strong>{jobName}</strong>
                    </td>
                    <td>
                      <State state={state} />
                    </td>
                    <td>
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          aria-valuenow={75}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <DateTime dateTime={plannedStartUtc} />
                    </td>
                    <td>
                      <RunInfo actualStartUtc={actualStartUtc} plannedStartUtc={plannedStartUtc} />
                    </td>
                  </tr>
                ))}
                {/*<tr>
              <td>
                <a route-href="route: rundetail; params.bind: {id: run.jobRunId}">${run.jobRunId}</a>
              </td>
              <td>
                <strong><a className="text-body" route-href="route: jobdetail; params.bind: { id: run.jobId}">${run.jobName}</a></strong>
              </td>
              <td>
                <span className="${run.state | jobRunStateToColor}">${run.state}</span>
              </td>
              <td>
                <div className="progress">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" css="width: ${run.progress}%">${run.progress}%</div>
                </div>
              </td>
              <td>${run.plannedStartUtc | date}</td>
              <td>${run.actualStartUtc | timeSince:run.plannedStartUtc}
                <span >later</span>
              </td>
            </tr>*/}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <HeaderRow icon="hdd" title="Storage" rowClasses="mt-4" />
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Free Space</th>
                  <th>Total Space</th>
                </tr>
              </thead>
              <tbody>
                {availableDisks.map(({ freeSpace, name, totalSpace }) => (
                  <tr className={utilStyles.listItem} key={name}>
                    <td>{name}</td>
                    <td className="text-success">
                      <DiskInfo space={freeSpace} />
                    </td>
                    <td>
                      <DiskInfo space={totalSpace} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        <HeaderRow
          icon="exclamation-triangle"
          title="Last 5 failed jobs"
          rowClasses="mt-4"
          iconClasses="extra-spacing-right text-danger"
        />
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">State</th>
                  <th scope="col">Planned Start</th>
                  <th scope="col">Actual Start</th>
                  <th scope="col">Duration</th>
                  <th scope="col">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {failedJobRuns.items.map(({ jobRunId, jobName, state, plannedStartUtc, actualStartUtc, duration }) => (
                  <tr className={utilStyles.listItem} key={jobRunId}>
                    <td>{jobRunId}</td>
                    <td>
                      <strong>{jobName}</strong>
                    </td>
                    <td>
                      <State state={state} />
                    </td>
                    <td>{plannedStartUtc}</td>
                    <td>
                      <RunInfo actualStartUtc={actualStartUtc} plannedStartUtc={plannedStartUtc} />
                    </td>
                    <td>{duration}</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-sm">
                        <i className="spin-loading fas fa-redo"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {/*<tr repeat.for="run of lastFailedJobRuns">
              <td>
                <a route-href="route: rundetail; params.bind: {id: run.jobRunId}">${run.jobRunId}</a>
              </td>
              <td>
                <strong><a className="text-body" route-href="route: jobdetail; params.bind: { id: run.jobId}">${run.jobName}</a></strong>
              </td>
              <td>
                <span className="${run.state | jobRunStateToColor}">${run.state}</span>
              </td>
              <td>${run.plannedStartUtc | date}</td>
              <td>${run.actualStartUtc | timeSince:run.plannedStartUtc}
                <span if.bind="run.actualStartUtc">later</span>
              </td>
              <td>${run.actualEndUtc | timeSince:run.actualStartUtc}</td>
              <td><button type="button" className="btn btn-primary btn-sm" loading="func.call: retryJobRun(run); spin-only: true"><i className="spin-loading fas fa-redo"></i></button></td>
          </tr>*/}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
}
