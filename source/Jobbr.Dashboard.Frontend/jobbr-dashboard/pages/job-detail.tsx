import React, { useState } from "react";
import Pagination from "../components/pagination";
import { getJob, getJobRuns } from "../lib/jobs";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";

export async function getStaticProps() {
  const job = await getJob(1);
  const jobRuns = await getJobRuns(1);
  return {
    props: {
      job,
      jobRuns,
    },
  };
}

export default function JobDetail({ job, jobRuns }) {
  const [showDeleted, setShowDeleted] = useState(false);
  const loadData = () => {
    // Function to load data
  };

  const changePage = (page) => {
    // Function to handle page change
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="container-fluid au-animate">
        {job.id && (
          <div className="row mb-4">
            <div className="col-md-auto">
              <h3>
                <a href={`jobdetail/${job.id}`}>
                  <i className="fas fa-angle-left"></i>
                </a>
                <i className="fas fa-suitcase mr-2"></i> {job.uniqueName}
              </h3>
            </div>
            <div className="col-md-6">
              <h3>
                <small>{job.type}</small>
              </h3>
            </div>
          </div>
        )}
        <div className="row mb-2">
          <div className="col-md-12">
            <div className="btn-toolbar" role="toolbar">
              <button type="button" className="btn btn-primary mr-2" onClick={loadData}>
                <i className="fas fa-sync-alt"></i>
              </button>
              {/* !jobId && <JobRunStatesDropDown selected={states} /> */}
              <div className="ml-auto">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-outline-warning ${showDeleted ? "active" : ""}`}
                    onClick={() => setShowDeleted(!showDeleted)}
                    title="Show deleted toggle"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Pagination pagedResult={jobRuns} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
