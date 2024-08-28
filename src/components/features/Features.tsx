import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { GherkinActions } from "../../../electron/shared/Actions";

interface Step {
  keyword: string;
  text: string;
}

interface Example {
  name: string;
  tableHeader: string[];
  tableBody: string[][];
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  tags: string[];
  steps: Step[];
  examples: Example[];
}

interface Feature {
  name: string;
  description: string;
  tags: string[];
  background: null; // Assuming background is not used
  scenarios: Scenario[];
}

interface FeatureFile {
  [key: string]: Feature;
}

// Styled components for keyword highlighting
const Keyword = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  paddingRight: '7px'
}));

const KeywordAccent = styled('span')(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 'bold'
}));

const Features = () => {
  const [features, setFeatures] = useState<FeatureFile>({});

  useEffect(() => {
    (async () => {
      const features = await window.ipcRenderer.invoke(GherkinActions.GetFeatures);
      setFeatures(features);
    })();
  }, []);

  const renderScenarioOutline = (scenario: Scenario) => {
    return (
      <>
        <Typography variant="body2">
          {scenario.steps.map((step, index) => (
            <div key={index}>
              <Keyword>{step.keyword}</Keyword> {step.text}
            </div>
          ))}
          {scenario.examples.length > 0 && (
            <>
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                <KeywordAccent>Examples:</KeywordAccent>
              </Typography>
              {scenario.examples.map((example, index) => (
                <Box key={index} sx={{ marginTop: 1 }}>
                  <Typography variant="body2">
                    <KeywordAccent>{example.tableHeader.join(' | ')}</KeywordAccent>
                  </Typography>
                  {example.tableBody.map((row, rowIndex) => (
                    <Typography key={rowIndex} variant="body2">
                      {row.join(' | ')}
                    </Typography>
                  ))}
                </Box>
              ))}
            </>
          )}
        </Typography>
      </>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {Object.keys(features).map((fileName) => {
        const feature = features[fileName];
        return (
          <Accordion key={fileName}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${fileName}-content`}
              id={`${fileName}-header`}
            >
              <Typography variant="h6">{feature.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                {feature.description && <Box mb={2}>{feature.description}</Box>}
                {feature.tags.length > 0 && (
                  <Box mb={2}>
                    {feature.tags.map((tag, index) => (
                      <Keyword key={index}>{tag}</Keyword>
                    ))}
                  </Box>
                )}
                {feature.scenarios.map((scenario) => (
                  <Box key={scenario.id} mb={4}>
                    {scenario.tags.length > 0 && (
                      <Box m={0} p={0}>
                        {scenario.tags.map((tag, index) => (
                          <Keyword key={index}>{tag}</Keyword>
                        ))}
                      </Box>
                    )}
                    <Typography variant="h6">
                      <KeywordAccent>
                        {scenario.name}
                      </KeywordAccent>
                    </Typography>
                    {renderScenarioOutline(scenario)}
                  </Box>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default Features;
