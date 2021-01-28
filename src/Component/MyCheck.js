import React from "react";

import { Steps, Button, message } from "antd";
import Main from "./Main";


const { Step } = Steps;

const steps = [
  {
    title: "화면",
  },
  {
    title: "음성",
  },
  {
    
    title: "공유",
  },
];

const MyCheck = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        
            <Main current={current} />
      </div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            다음단계
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("환영합니다^^!")}
          >
            완료하기
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            이전단계
          </Button>
        )}
      </div>
    </>
  );
};

export default MyCheck;
