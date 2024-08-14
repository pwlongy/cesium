import request from './request'

export function changeStatus(jobId, status) {
  return request({
    url: "/api/schedule/ext/monitor/job/changeStatus",
    method: "put",
    data: {
      jobId,
      status,
    },
  });
}
export function run(jobId, jobGroup) {
  return request({
    url: "/api/schedule/ext/monitor/job/run",
    method: "put",
    data: {
      jobId,
      jobGroup,
    },
  });
}

export function delListJob(jobIds) {
  return request({
    url: "/api/schedule/ext/monitor/job/" + jobIds,
    method: "delete",
  });
}
