import React from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getAllJobRuns } from "../lib/jobs";
import utilStyles from "../styles/utils.module.scss";
import RunInfo from "../components/run-info";
import Pagination from "../components/pagination";
import DateTime from "../components/date-time";
import State from "../components/state";

export async function getStaticProps() {
  const jobRuns = await getAllJobRuns();
  return {
    props: {
      jobRuns,
    },
  };
}

export default function Runs({ jobRuns }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className="row">
          <div className="col-sm-12">
            <h3>
              <i className="fas fa-flag-checkered mr-2"></i> All runs
            </h3>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-12">
            <div className="btn-toolbar" role="toolbar">
              <button type="button" className="btn btn-primary mr-2">
                <i className="fas fa-sync-alt"></i>
              </button>
              { /* <job-run-states-drop-down></job-run-states-drop-down> */ }
              <div className="input-group ml-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                <input type="text" className="form-control" placeholder="Search" />
              </div>
              <div className="ml-auto">
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-outline-warning" title="Show deleted toggle">
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {jobRuns.items.map(({ jobRunId, jobName, state, plannedStartUtc, actualStartUtc, duration }) => (
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
                    <td>{duration}</td>
                  </tr>
                ))}
                {/*<tr repeat.for="job of jobs.items">
              <td>
                <a route-href="route: jobdetail; params.bind: {id: job.id}">${job.id}</a>
              </td>
              <td>
                <strong>${job.uniqueName}</strong>
              </td>
              <td>
                <img src="../../static/img/vxclass_icon.gif" alt="class"> ${job.type}
              </td>
              <td>${job.createdDateTimeUtc | date}</td>
              <td>${job.updatedDateTimeUtc | date}</td>
              </tr>*/}
              </tbody>
            </table>
            <Pagination pagedResult={jobRuns} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
