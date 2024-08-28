// Interface for the step in a scenario
interface Step {
    keyword: string;
    text: string;
  }
  
  // Interface for the example table in a scenario outline
  interface Example {
    name: string;
    tableHeader: string[];
    tableBody: string[][];
  }
  
  // Interface for a scenario (either regular or outline)
  interface Scenario {
    id: string;
    name: string;
    description: string;
    tags: string[];
    steps: Step[];
    examples: Example[];
  }
  
  // Interface for the feature
  interface Feature {
    name: string;
    description: string;
    tags: string[];
    background: null; // Assuming background is not used in the current data
    scenarios: Scenario[];
  }
  
  // Interface for the entire JSON structure
  interface FeatureFile {
    [key: string]: Feature;
  }