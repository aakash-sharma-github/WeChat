import React, { useEffect, useState } from "react";
import { MeetingType } from "../utils/Types";
import { meetingsRef } from "../utils/FirebaseConfig";
import { getDocs, query, where } from "firebase/firestore";
import { useAppSelector } from "../app/hooks";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import {
  EuiBadge,
  EuiBasicTable,
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiPanel
} from "@elastic/eui";
import moment from "moment";
import { Link } from "react-router-dom";

export default function Meetings() {
  useAuth();
  const [meetings, setMeetings] = useState<any>([]);
  const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);

  useEffect(() => {
    if (userInfo) {
      const getUserMeetings = async () => {
        const firestoreQuery = query(meetingsRef);
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
          const myMeetings: Array<MeetingType> = [];
          fetchedMeetings.forEach((meeting) => {
            const data = meeting.data() as MeetingType;
            if (data.createdBy === userInfo?.uid) myMeetings.push(data);
            else if (data.meetingType === "anyone-can-join")
              myMeetings.push(data);
            else {
              const index = data.invitedUsers.findIndex(
                (user) => user === userInfo.uid
              );
              if (index !== -1) {
                myMeetings.push(data);
              }
            }
          });
          setMeetings(myMeetings);
        }
      };
      getUserMeetings();
    }
  }, [userInfo]);

  const columns = [
    {
      field: "meetingName",
      name: "Meeting Name"
    },
    {
      field: "meetingType",
      name: "Meeting Type"
    },
    {
      field: "meetingDate",
      name: "Meeting Date"
    },
    {
      field: "",
      name: "Status",
      render: (meeting: MeetingType) => {
        if (meeting.status) {
          if (meeting.meetingDate === moment().format("L")) {
            return (
              <EuiBadge color="success">
                <Link
                  style={{ color: "black" }}
                  to={`/join/${meeting.meetingId}`}
                >
                  Join Now
                </Link>
              </EuiBadge>
            );
          } else if (
            moment(meeting.meetingDate).isBefore(moment().format("L"))
          ) {
            return <EuiBadge color="default">Ended</EuiBadge>;
          } else {
            return <EuiBadge color="#2a56d1">Upcomming</EuiBadge>;
          }
        } else return <EuiBadge color="danger">Cancelled</EuiBadge>;
      }
    },
    {
      field: "meetingId",
      name: "Copy Link",
      render: (meetingId: string) => {
        return (
          <EuiCopy
            textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}
          >
            {(copy: any) => (
              <EuiButtonIcon
                color={"ghost"}
                iconType="copy"
                onClick={copy}
                display="base"
                aria-label="Meeting-copy"
              />
            )}
          </EuiCopy>
        );
      }
    }
  ];
  return (
    <div
      style={{
        display: "flex",
        height: "10vh",
        flexDirection: "column"
      }}
    >
      <Header />
      <EuiFlexGroup justifyContent="center" style={{ margin: "1rem" }}>
        <EuiFlexItem>
          <EuiPanel>
            <EuiBasicTable items={meetings} columns={columns} />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}
