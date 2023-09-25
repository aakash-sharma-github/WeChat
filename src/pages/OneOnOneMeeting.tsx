import React, { useState } from "react";
import Header from "../components/Header";
import { EuiFlexGroup, EuiForm, EuiSpacer } from "@elastic/eui";
import MeetingNameField from "../components/formComponent/MeetingNameField";
import MeetingUsersField from "../components/formComponent/MeetingUsersField";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import moment from "moment";
import MeetingDateField from "../components/formComponent/MeetingDateField";
import CreateMeetingButtons from "../components/formComponent/CreateMeetingButtons";
import CreateMeeting from "./CreateMeeting";
import { FieldErrorType, UserType } from "../utils/Types";
import { meetingsRef } from "../utils/FirebaseConfig";
import { generateMeetingId } from "../utils/generateMeetingid";
import { addDoc } from "firebase/firestore";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

function OneOnOneMeeting() {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();

  const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid);
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startData, setStartDate] = useState(moment());
  const [showErrors, setShowErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: []
    },
    meetingUser: {
      show: false,
      message: []
    }
  });

  const onUserChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };

  const validateForm = () => {
    let errors = false;
    const cloneShowErrors = { ...showErrors };
    if (!meetingName.length) {
      cloneShowErrors.meetingName.show = true;
      cloneShowErrors.meetingName.message = ["Please Enter a Meeting Name"];
      errors = true;
    } else {
      cloneShowErrors.meetingName.show = false;
      cloneShowErrors.meetingName.message = [];
    }
    if (!selectedUsers.length) {
      cloneShowErrors.meetingUser.show = true;
      cloneShowErrors.meetingUser.message = ["Please Select a User"];
      errors = true;
    } else {
      cloneShowErrors.meetingUser.show = false;
      cloneShowErrors.meetingUser.message = [];
    }
    setShowErrors(cloneShowErrors);
    return errors;
  };

  const createMeeting = async () => {
    if (!validateForm()) {
      const meetingId = generateMeetingId();
      await addDoc(meetingsRef, {
        createdBy: uid,
        meetingId,
        meetingName,
        meetingType: "1-on-1",
        invitedUsers: [selectedUsers[0].uid],
        meetingDate: startData.format("L"),
        maxUsers: 1,
        status: true
      });
      createToast({
        title: "One on  One meeting has been created successfully.",
        type: "success"
      });
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column"
      }}
    >
      <Header />
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiForm>
          <MeetingNameField
            label="Meeting Name"
            placeholder="Meeting Name"
            value={meetingName}
            setMeetingName={setMeetingName}
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
          />
          <MeetingUsersField
            label="Invite User"
            options={users}
            onChange={onUserChange}
            selectedOptions={selectedUsers}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            placeholder="select a user"
            isInvalid={showErrors.meetingUser.show}
            error={showErrors.meetingUser.message}
          />
          <MeetingDateField selected={startData} setStartDate={setStartDate} />
          <EuiSpacer />
          <CreateMeetingButtons createMeeting={createMeeting} />
        </EuiForm>
      </EuiFlexGroup>
    </div>
  );
}

export default OneOnOneMeeting;
