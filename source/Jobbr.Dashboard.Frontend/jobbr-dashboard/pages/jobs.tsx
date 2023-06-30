import React from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getAvailalbeJobs } from "../lib/jobs";
import utilStyles from "../styles/utils.module.scss";
import DateTime from "../components/date-time";

export async function getStaticProps() {
  const jobs = await getAvailalbeJobs();
  return {
    props: {
      jobs,
    },
  };
}

export default function Jobs({ jobs }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className="row">
          <div className="col-sm-12">
            <h3>
              <i className="fas fa-suitcase extra-space-right mr-2"></i> Jobs
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Created</th>
                  <th scope="col">Last update</th>
                </tr>
              </thead>
              <tbody>
                {jobs.items.map(({ id, uniqueName, type, createdDateTimeUtc, updatedDateTimeUtc }) => (
                  <tr className={utilStyles.listItem} key={id}>
                    <td>{id}</td>
                    <td>
                      <strong>{uniqueName}</strong>
                    </td>
                    <td>
                      <img src="images/vxclass_icon.gif" alt="class" /> {type}
                    </td>
                    <td>
                      <DateTime dateTime={createdDateTimeUtc} />
                    </td>
                    <td>
                      <DateTime dateTime={updatedDateTimeUtc} />
                    </td>
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
          </div>
        </div>
      </section>
    </Layout>
  );
}
