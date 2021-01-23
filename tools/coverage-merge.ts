// read from all coverage files in integration and packages
// set up proper paths for each coverage file (replace src/<file> with <directory>/src<file>)
// write to lcov.info as the final coverage final
import { existsSync, promises } from 'fs';
import { join } from 'path';

const packageDir = 'packages';
const integrationDir = 'integration';
const coverageDir = 'coverage-tmp';

async function readPackagesDirectory(): Promise<string[]> {
  return promises.readdir(packageDir);
}

async function readCoverageFile(directory: string): Promise<Buffer> {
  return promises.readFile(
    join(process.cwd(), packageDir, directory, 'coverage', 'coverage-final.json'),
  );
}

async function readIntegrationCoverage(): Promise<Buffer> {
  return promises.readFile(join(process.cwd(), integrationDir, 'coverage', 'coverage-final.json'));
}

async function mapCoverages(directories: string[]): Promise<Record<string, Buffer>> {
  const coverages: Record<string, Buffer> = {};
  for (const direct of directories) {
    coverages[direct] = await readCoverageFile(direct);
  }
  return coverages;
}

async function writeCoveragesToSingleDir(coverages: Record<string, Buffer>): Promise<void> {
  for (const key of Object.keys(coverages)) {
    await promises.writeFile(
      join(process.cwd(), coverageDir, key + '-coverage.json'),
      coverages[key],
    );
  }
}

async function migrateCoverage(): Promise<void> {
  if (existsSync(join(process.cwd(), coverageDir))) {
    await promises.rm(coverageDir, { recursive: true });
  }
  const directories = await readPackagesDirectory();
  const coverages = await mapCoverages(directories);
  coverages['integration'] = await readIntegrationCoverage();
  await promises.mkdir(join(process.cwd(), coverageDir));
  await writeCoveragesToSingleDir(coverages);
}

migrateCoverage();
