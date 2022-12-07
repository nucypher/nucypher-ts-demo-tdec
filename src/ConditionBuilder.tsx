import { ConditionSet, Condition, Conditions } from "@nucypher/nucypher-ts";
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";

interface Props {
  conditions?: ConditionSet;
  setConditions: (value: ConditionSet) => void;
  enabled: boolean;
}

export const ConditionBuilder = ({
  conditions,
  setConditions,
  enabled
}: Props) => {
  const { library } = useEthers();
  const NFTBalanceConfig = {
    contractAddress: '0x77566D540d1E207dFf8DA205ed78750F9a1e7c55',
    standardContractType: 'ERC721',
    chain: 5,
    method: 'ownerOf',
    parameters: [118],
    returnValueTest: {
      comparator: '==',
      value: ':userAddress',
    },
  };
  const DEMO_CONDITION = JSON.stringify(NFTBalanceConfig);
  const [conditionjson, setConditionJSON] = useState(
    DEMO_CONDITION
  );


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


  const ConditionJSONInput = makeInput(
    setConditionJSON,
    DEMO_CONDITION
  );


  const onCreateCondition = (e: any) => {
    e.preventDefault();
    setConditions(new ConditionSet([new Conditions.Condition(JSON.parse(conditionjson))]));
  };

  const ConditionList =
    conditions && conditions?.conditions.length > 0 ? (
      <div>
        <h3>Condition JSON Preview</h3>
        <pre>
          {conditions?.conditions.map((condition, index) => (
            <div key={index}>
              {JSON.stringify((condition as Condition).toObj(), null, 2)}
            </div>
          ))}
        </pre>
      </div>
    ) : (
      <></>
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
