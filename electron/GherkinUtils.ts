import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { getConfig } from './storage/ElectronStorage';
import { IdGenerator } from '@cucumber/messages';
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin';
import { ConfigKeys, GherkinActions } from './shared/Actions';

function parseGherkinFeature(fileContent) {
    const uuidFn = IdGenerator.uuid();
    const builder = new AstBuilder(uuidFn);
    const matcher = new GherkinClassicTokenMatcher();
    const parser = new Parser(builder, matcher);

    try {
        const gherkinDocument = parser.parse(fileContent);
        return gherkinDocument;
    } catch (error) {
        console.error('Error loading or parsing the Gherkin feature file:', error);
        throw error;
    }
}

export const setupGherkinUtils = () => {
    ipcMain.handle(GherkinActions.GetFeatures, async (event) => {
        const repoDir = getConfig(ConfigKeys.repoPath) as string;
        const folder = path.join(repoDir, 'e2e/features');
        const files = fs.readdirSync(folder).filter(file => file.endsWith('.feature'));

        const featureJsonMap = {};

        for (const file of files) {
            const filePath = path.join(folder, file);

            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const response = await parseGherkinFeature(fileContent);

                const commonFormat = parseGherkinDocumentToCommonFormat(response);
                featureJsonMap[file] = commonFormat
                fs.writeFileSync(path.join(folder, 'generated', file + '.json'), JSON.stringify(commonFormat, null, 2));

                const ghresp = generateGherkin(featureJsonMap[file]);
                //fs.writeFileSync(path.join(folder, 'generated', file + '-generated.feature'), ghresp);

                //fs.writeFileSync(path.join(folder, 'generated', file + '-d.feature'), generateGherkin(parseGherkinDocumentToCommonFormat(parseGherkinFeature(ghresp))))
            } catch (error) {
                console.error(`Failed to parse ${file}:`, error);
            }
        }

        fs.writeFileSync(path.join(folder, 'json.json'), JSON.stringify(featureJsonMap, null, 2));
        return featureJsonMap;
    });
};

function parseGherkinDocumentToCommonFormat(gherkinDocument) {
    const feature = gherkinDocument.feature;

    return {
        name: feature.name,
        description: feature.description.trim(),
        tags: feature.tags.map(tag => tag.name),
        background: feature.children.find(child => child.scenario && child.scenario.keyword === 'Background')?.scenario || null,
        scenarios: feature.children
            .filter(child => child.scenario && child.scenario.keyword !== 'Background')
            .map(child => {
                const scenario = child.scenario;
                return {
                    id: scenario.id,
                    name: scenario.name,
                    description: scenario.description.trim(),
                    tags: scenario.tags.map(tag => tag.name),
                    steps: scenario.steps.map(step => ({
                        keyword: step.keyword,
                        text: step.text
                    })),
                    examples: scenario.examples.map(example => ({
                        name: example.name.trim(),
                        tableHeader: example.tableHeader.cells.map(cell => cell.value),
                        tableBody: example.tableBody.map(row => row.cells.map(cell => cell.value))
                    }))
                };
            })
    };
}

function generateGherkin(parsedFeature) {
    let gherkin = `Feature: ${parsedFeature.name}\n\n`;

    if (parsedFeature.description) {
        gherkin += `  ${parsedFeature.description}\n\n`;
    }

    // Ensure tags are formatted correctly
    if (parsedFeature.tags.length > 0) {
        gherkin += parsedFeature.tags.map(tag => `@${tag.replace(/^@/, '')}`).join('\n') + '\n\n';
    }

    if (parsedFeature.background) {
        gherkin += `Background:\n`;
        parsedFeature.background.steps.forEach(step => {
            gherkin += `  ${step.keyword} ${step.text}\n`;
        });
        gherkin += `\n`;
    }

    parsedFeature.scenarios.forEach(scenario => {
        if (scenario.tags.length > 0) {
            gherkin += scenario.tags.map(tag => `@${tag.replace(/^@/, '')}`).join(' ') + '\n';
        }
        gherkin += `Scenario${scenario.examples.length > 0 ? ' Outline' : ''}: ${scenario.name}\n`;

        if (scenario.description) {
            gherkin += `  ${scenario.description}\n`;
        }

        scenario.steps.forEach(step => {
            gherkin += `  ${step.keyword} ${step.text}\n`;
        });

        if (scenario.examples.length > 0) {
            scenario.examples.forEach(example => {
                gherkin += `  Examples:\n`;
                gherkin += `    | ${example.tableHeader.join(' | ')} |\n`;
                example.tableBody.forEach(row => {
                    gherkin += `    | ${row.map(cell => cell.padEnd(8)).join(' | ')} |\n`;
                });
            });
        }

        gherkin += `\n`;
    });

    return gherkin.trim();
}


