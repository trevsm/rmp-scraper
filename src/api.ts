import "graphql-import-node";
import "dotenv/config";

import axios from "axios";
import { DocumentNode } from "graphql";
import { Ratings, Schools, Teachers } from "./graphql";

const API_URL = "https://ratemyprofessors.com/graphql";
const headers = {
  Host: "www.ratemyprofessors.com",
  Authorization: process.env.AUTH,
};

interface variablesType {
  id?: string;
  query?: {
    text?: string;
    schoolID?: string;
  };
}

const authRequest = async (query: DocumentNode, variables: variablesType) => {
  console.log(variables);

  const res = await axios.post(
    API_URL,
    {
      query: query.loc.source.body,
      variables,
    },
    { headers }
  );

  if (!res.data.data) return Promise.reject(res.data.errors);
  return res.data.data;
};

export const getTeacherRatings = async (id: string) =>
  await authRequest(Ratings, { id })
    .then((data) => data.node)
    .catch((err) => err);

export const searchSchools = async (text: string) =>
  await authRequest(Schools, { query: { text } })
    .then((data) => data.newSearch.schools.edges)
    .catch((err) => err);

export const searchTeachers = async (text: string, schoolID: string) =>
  await authRequest(Teachers, { query: { text, schoolID } })
    .then((data) => data.newSearch.teachers.edges)
    .catch((err) => err);
