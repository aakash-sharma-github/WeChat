import React, { useEffect, useState } from "react";
import { FieldErrorType, MeetingType, UserType } from "../utils/Types";
import useFetchUsers from "../hooks/useFetchUsers";
import useToast from "../hooks/useToast";
import { useAppSelector } from "../app/hooks";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../utils/FirebaseConfig";
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiTitle
} from "@elastic/eui";
import MeetingNameField from "./formComponent/MeetingNameField";
import MeetingMaximumUsersField from "./formComponent/MeetingMaximumUserField";
import MeetingUsersField from "./formComponent/MeetingUsersField";
import MeetingDateField from "./formComponent/MeetingDateField";
import CreateMeetingButtons from "./formComponent/CreateMeetingButtons";

export default function EditFlyout({
  closeFlyout,
  meetings
}: {
  closeFlyout: any;
  meetings: MeetingType;
}) {
  useAuth();
  const [users] = useFetchUsers();
  const [createToast] = useToast();

  const [meetingName, setMeetingName] = useState(meetings.meetingName);
  const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
  const [size, setSize] = useState(1);
  const [meetingType] = useState(meetings.meetingType);
  const [status, setStatus] = useState(false);
  const [showErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUsers: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: []
    },
    meetingUsers: {
      show: false,
      message: []
    }
  });

  useEffect(() => {
    if (users) {
      const foundUsers: Array<UserType> = [];
      meetings.invitedUsers.forEach((user: string) => {
        const findUser = users.find(
          (tempUser: UserType) => tempUser.uid === user
        );
        if (findUser) foundUsers.push(findUser);
      });
      setSelectedUser(foundUsers);
    }
  }, [meetings, users]);

  const onUserChange = (selectedOptions: Array<UserType>) => {
    setSelectedUser(selectedOptions);
  };

  const editMeeting = async () => {
    const editMeeting = {
      ...meetings,
      meetingName,
      meetingType,
      invitedUsers: selectedUser.map((user: UserType) => user.uid),
      maxUser: size,
      meethingDate: startDate.format("L"),
      status: !status
    };
    delete editMeeting.docId;
    const docRef = doc(firebaseDB, "meetings", meetings.docId!);
    await updateDoc(docRef, editMeeting);
    createToast({ title: "meeting updated successfully.", type: "success" });
    closeFlyout(true);
  };
  return (
    <EuiFlyout ownFocus onClose={() => closeFlyout()}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{meetings.meetingName}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiForm>
          <MeetingNameField
            label="Meeting name"
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            placeholder="Meeting name"
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          {meetingType === "anyone-can-join" ? (
            <MeetingMaximumUsersField value={size} setSize={setSize} />
          ) : (
            <MeetingUsersField
              label="Invalid Users"
              isInvalid={showErrors.meetingUsers.show}
              error={showErrors.meetingUsers.message}
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUser}
              singleSelection={
                meetingType === "1-on-1" ? { asPlainText: true } : false
              }
              isClearable={false}
              placeholder="Select a User"
            />
          )}
          <MeetingDateField selected={startDate} setStartDate={setStartDate} />
          <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
            <EuiSwitch
              showLabel={false}
              label="Cancel Meeting"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer />
          <CreateMeetingButtons
            createMeeting={editMeeting}
            isEdit
            closeFlyout={closeFlyout}
          />
        </EuiForm>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
