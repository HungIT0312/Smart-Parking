import React from "react";
import { useEffect } from "react";
import { getAccountById } from "../../api/Client/Profile";

export default function Profile(props) {
  useEffect(() => {
    const _getProfile = async () => {
      const res = await getAccountById();
      console.log(res);
    };
    _getProfile();
  }, []);

  return <div>Profile</div>;
}
