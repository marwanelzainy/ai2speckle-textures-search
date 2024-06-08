import React from "react";

import { Card, Col, Row } from "antd";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const Index = () => {
  const introText = `
# Welcome to ai2speckle: Texture Search App

This App was made in Beyond the Speckleverse Hackathon by [Marwan Elzainy](https://linkedin.com/in/marwan-elzainy), [Josie Harrison](https://www.linkedin.com/in/josie-harrison-20071752/), [Abhishek Shinde](https://www.linkedin.com/in/arabhishek11/) and [Jordana Rosa](https://www.linkedin.com/in/jordanarosa/).

Special thanks to [Antoine Dao](https://github.com/AntoineDao) & [StableDesign team](https://huggingface.co/spaces/MykolaL/StableDesign)

## Source Code

The source code for this application is available on [GitHub](https://github.com/marwanelzainy/ai2speckle-textures-search).

## User Quick Start

### Pre-requisites

- [Speckle Account](https://app.speckle.systems). You must create one first if you don't have one already.
- You need to create a project and upload your 3D model.

### Testing This Application
You can test this application out by logging in using the "Log In" button on the top right corner. This will take you to the main Speckle Server (https://app.speckle.systems) where you can log in using your Speckle Account credentials. Once you log in, you will be redirected back to this application and you will be able to see your user information on the top right corner.

You can then view your projects by clicking on the "Projects" button on the top middle part of this screen.

After you choose a Model, your 3D model will be displayed.

On the right side of the screen you can write a Text prompt, then click the "AI Render" button.

If you are happy with the result, you can extract the materials by clicking on the "Extract" button.

After a brief amount of time, extracted materials will be listed on the right side of the screen.

You can select an Object from the model and a material then click "Assign material to selected object" to assign it.

You can click on the "Commit to Speckle" button to commit the result to the Speckle Server.

And that's it! It's a pretty simple application.

## Running This Application Locally


### Prerequisites
- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [Python](https://www.python.org/downloads/) (version 3.8 or higher)

### Installation

To get started, clone this repository and install the dependencies:

\`\`\`bash
git clone https://github.com/marwanelzainy/ai2speckle-textures-search

# install and run the frontend
cd app
npm install
npm start

cd ..

# also install and run the backend
cd AI_image_Analyzer
pip install -r requirements.txt
fastapi dev app.py
\`\`\`

### Configuration

The application requires a Speckle Server to be running and a [Speckle Application](https://speckle.guide/dev/apps.html) to be configured on the server. The application will use the \`http://localhost:3000\` URL by default, so make sure to configure the application with this URL.

This template uses the main [Speckle Server](https://app.speckle.systems) by default. To use a different server, you can change the \`REACT_APP_SERVER_URL\` environment variable in the \`.env\` file.

This template also comes pre-packages with the Application id and secret for the Local dev app owned by Marwan Elzainy. You can use it to test the code out before creating you own Application. To use your own Application, you can change the \`REACT_APP_APP_ID\` and \`REACT_APP_APP_SECRET\` environment variables in the \`.env\` file.

## Application Structure

The application is structured as follows:

- Frontend: \`app\`
    - \`src/components\` - contains the React UI components. The subfolders follow the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) methodology:
        - \`src/components/atoms\` - contains the smallest components, such as buttons, inputs, etc.
        - \`src/components/molecules\` - contains components that are composed of atoms
        - \`src/components/organisms\` - contains components that are composed of molecules and/or atoms
        - \`src/components/templates\` - contains components that are composed of organisms, molecules and/or atoms
        - \`src/components/pages\` - contains components that are composed of templates, organisms, molecules and/or atoms
    - \`src/context\` - contains React Context objects used to share authentication, user and graphql clients across the application
    - \`src/hooks\` - contains an example React Hook that to featch a list of streams from the Speckle Server
    - \`src/App.js\` - the main application component

- Backend: \`AI_image_Analyzer\`
    - \`app.py\` - the FastAPI application

    `;

  return (
    <Row>
      <Col span={24}>
        <Card>
          <ReactMarkdown
            children={introText}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, "")}
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Index;
