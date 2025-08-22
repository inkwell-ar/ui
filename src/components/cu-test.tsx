import { Button } from "./ui/button";
import { connect } from "@permaweb/aoconnect";

export default function CUTest() {
  const testCU = async () => {
    console.log(" >> testCU called << ");

    const { dryrun } = connect({
      MODE: "legacy",
      //   GATEWAY_URL: "...",
      //   GRAPHQL_URL: "...",
      //   GRAPHQL_MAX_RETRIES: 2,
      //   GRAPHQL_RETRY_BACKOFF: 250,
      //   MU_URL: "...",
      CU_URL: "https://gateway.ar",
    });

    console.log(" >> aoconnect initialized << ");

    dryrun({
      data: "",
      anchor: "1234",
      process: "n2DbyGJVMMyZuDt8zDTS5QCfo4j1TRRsCEU9oj0uJ8M",
      tags: [{ name: "Action", value: "Info" }],
    }).then((result) => {
      console.log(" >> dryRun result: << ");
      console.log(result);
    });

    dryrun({
      data: "",
      anchor: "1234",
      process: "n2DbyGJVMMyZuDt8zDTS5QCfo4j1TRRsCEU9oj0uJ8M",
      tags: [
        { name: "Action", value: "Balance" },
        {
          name: "Recipient",
          value: "JNNifa9nCmIImyuiRyP21Td9CCINrtQV0dALGRIBfyE",
        },
      ],
    }).then((result) => {
      console.log(" >> dryRun result: << ");
      console.log(result);
    });
  };

  return <Button onClick={testCU}>Test CU</Button>;
}
