import { conditions } from "@nucypher/nucypher-ts";
import React, { useState } from "react";
import { Mumbai, useEthers } from "@usedapp/core";

interface Props {
  conditionExpr?: conditions.ConditionExpression;
  setConditions: (value: conditions.ConditionExpression) => void;
  enabled: boolean;
}

export const ConditionBuilder = ({
  conditionExpr,
  setConditions,
  enabled,
}: Props) => {
  const { library } = useEthers();
  const RpcCondition = {
    chain: Mumbai.chainId,
    method: "eth_getBalance",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  };
  const DEMO_CONDITION = JSON.stringify(RpcCondition);
  const [conditionJson, setConditionJson] = useState(DEMO_CONDITION);

  if (!enabled || !library) {
    return <></>;
  }

  const makeInput = (
    onChange = (e: any) => console.log(e),
    defaultValue: string
  ) => (
    <textarea
      rows={15}
      onChange={(e: any) => onChange(e.target.value)}
      defaultValue={defaultValue}
    >
      {}
    </textarea>
  );

  const ConditionJSONInput = makeInput(setConditionJson, DEMO_CONDITION);

  const onCreateCondition = (e: any) => {
    e.preventDefault();
    setConditions(
      new conditions.ConditionExpression(
        new conditions.Condition(JSON.parse(conditionJson))
      )
    );
  };

  const ConditionList = conditionExpr && (
    <div>
      <h3>Condition JSON Preview</h3>
      <pre>
        <div>{JSON.stringify(conditionExpr.toObj(), null, 2)}</div>
      </pre>
    </div>
  );

  return (
    <>
      <h2>Step 1 - Create A Conditioned Access Policy</h2>
      <div>
        <div>
          <h3>Customize your Conditions</h3>
          <div>
            <p>Condition JSON {ConditionJSONInput}</p>
          </div>
          <button onClick={onCreateCondition}>Create Conditions</button>
        </div>
        {ConditionList}
      </div>
    </>
  );
};
