import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_STREAMS = gql`
  query GetStreams {
    streams {
      items {
        id
        name
        branches {
          totalCount
          items {
            name
            commits {
              items {
                referencedObject
              }
            }
          }
        }
      }
    }
  }
`;

export const useStreams = () => {
  const { loading, error, data } = useQuery(GET_STREAMS);

  const streams = useMemo(() => {
    if (data) {
      // console.log(data);
      return data.streams.items;
    }
    return [];
  }, [data]);

  return {
    streams,
    loading,
    error,
  };
};
