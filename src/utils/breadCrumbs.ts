import { NavigateFunction } from "react-router-dom";
import { BreadCrumbsType } from "./Types";

export const getCreateMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "Dashboard",
    herf: "#",
    onClick: () => {
      navigate("/");
    }
  },
  {
    text: "Create Meeting"
  }
];

export const getOneonOneonMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "Dashboard",
    herf: "#",
    onClick: () => {
      navigate("/");
    }
  },
  {
    text: "Create Meeting",
    herf: "#",
    onClick: () => {
      navigate("/create");
    }
  },
  {
    text: "Create Personal Meeting"
  }
];

export const getVideoConferenceBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "Dashboard",
    herf: "#",
    onClick: () => {
      navigate("/");
    }
  },
  {
    text: "Create Meeting",
    herf: "#",
    onClick: () => {
      navigate("/create");
    }
  },
  {
    text: "Create Video Conference"
  }
];

export const getMyMeetingsBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "Dashboard",
    herf: "#",
    onClick: () => {
      navigate("/");
    }
  },
  {
    text: "My Meetings"
  }
];

export const getMeetingBreadCrumbs = (
  navigate: NavigateFunction
): Array<BreadCrumbsType> => [
  {
    text: "Dashboard",
    herf: "#",
    onClick: () => {
      navigate("/");
    }
  },
  {
    text: "Meetings"
  }
];
