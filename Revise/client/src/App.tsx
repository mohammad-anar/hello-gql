import { gql } from "@apollo/client";
import "./App.css";
import { useQuery } from "@apollo/client/react";

const query = gql`
  query GetLocations {
    getTodos {
      id
      title
      user {
        name
        email
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery<any>(query);
  console.log(data);

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <>
      <section>
        {data.getTodos.map((todo: any) => (
          <div style={{marginBottom: "20px"}}>
            <h2>{todo.title}</h2>
              <p>{todo.user.name}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default App;
