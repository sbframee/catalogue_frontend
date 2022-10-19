import Layout from "../layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Home() {
  const [organization, setOrganization] = useState({});
  const GetOrganizationData = async (domain) => {
    const response = await axios({
      method: "post",
      url: "Organization/getOrganization/",
      data: { domain },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setOrganization(response.data.result);
  };
  useEffect(() => {
    let domain =
      window.location.host +
      (window.localStorage.port ? ":" + window.localhost.port : "");
    GetOrganizationData(domain);
  }, []);
  return <Layout organization={organization} />;
}
