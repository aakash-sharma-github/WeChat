import React from "react";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import single from "../assets/single.png";
import group from "../assets/group.png";
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from "@elastic/eui";
import { useNavigate } from "react-router-dom";

function CreateMeeting() {
  useAuth();
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column"
      }}
    >
      <Header />
      <EuiFlexGroup
        justifyContent="center"
        alignItems="center"
        style={{ margin: "5vh 10vw" }}
      >
        <EuiFlexItem>
          <EuiCard
            icon={<EuiImage size="5rem" alt="icon" src={single} />}
            title={`1 on 1 Meeting`}
            description="Create new personal meeting."
            onClick={() => navigate("/create1on1")}
            paddingSize="xl"
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            icon={<EuiImage size="5rem" alt="icon" src={group} />}
            title={`Video Conference`}
            description="Create new video conference."
            onClick={() => navigate("/videoconference")}
            paddingSize="xl"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}

export default CreateMeeting;
