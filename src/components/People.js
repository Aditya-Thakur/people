import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Person from "./person";
import MyPagination from "./PaginationComponent";
//Create a client
const queryClient = new QueryClient();
//Fetch data from api
const fetchPeople = async () => {
  const res = await fetch(`http://swapi.dev/api/people/`);
  return res.json();
};
//Queries
const People = () => {
  const [personList, setTagList] = React.useState([]);
  const [currPage, setCurrPage] = React.useState(3);

  React.useEffect(() => {
    afterPageClicked(3);
  }, []);

  const { data, status } = useQuery(["people"], fetchPeople);
  // console.log(data);
  const afterPageClicked = (page_number) => {
    setCurrPage(page_number);
    fetch(`https://dummyapi.io/data/api/tag?limit=10&page=${page_number}`, {
      headers: {
        "app-id": "60983c4f56c487f12fd13e23"
      }
    })
      .then((response) => response.json())
      .then((data) => setTagList(data.data));
  };
  return (
    <div>
      {/* <p>{status}</p> */}
      {status === "loading" && <div>loading data..</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && (
        <div>
          {data.results.map((person) => (
            <Person key={person.name} person={person} />
          ))}
        </div>
      )}

      <MyPagination
        totPages={20}
        currentPage={currPage}
        pageClicked={(ele) => {
          afterPageClicked(ele);
        }}
      >
        <ul>
          {personList.map((ele, ind) => {
            return <li key={ele + ind}>{ele}</li>;
          })}
        </ul>
      </MyPagination>

    </div>

  );
};

// Provide the client to App
export default function Wraped() {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <People />
    </QueryClientProvider>
  );
}
