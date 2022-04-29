// read from all coverage files in integration and packages
// set up proper paths for each coverage file (replace src/<file> with <directory>/src<file>)
// write to lcov.info as the final coverage final
import { existsSync, promises } from 'fs';
import { join } from 'path';

const packageDir = 'packages';
const integrationDir = 'integration';
const coverageTempDir = 'coverage-tmp';
const coverageFinal = 'lcov.info';
const coverageDir = 'coverage';

async function readPackagesDirectory(): Promise<string[]> {
  return promises.readdir(packageDir);
}

async function readCoverageFile(directory: string): Promise<Buffer> {
  return promises.readFile(join(process.cwd(), packageDir, directory, coverageDir, coverageFinal));
}

async function readIntegrationCoverage(): Promise<Buffer> {
  return promises.readFile(join(process.cwd(), integrationDir, coverageDir, coverageFinal));
}

async function mapCoverages(directories: string[]): Promise<Record<string, Buffer>> {
  const coverages: Record<string, Buffer> = {};
  for (const direct of directories) {
    try {
      coverages[direct] = await readCoverageFile(direct);
    } catch {
      // no-op
    }
  }
  return coverages;
}

async function writeCoveragesToSingleDir(coverages: Record<string, Buffer>): Promise<void> {
  for (const key of Object.keys(coverages)) {
    await promises.writeFile(
      join(process.cwd(), coverageTempDir, key + '-lcov.info'),
      coverages[key],
    );
  }
}

async function migrateCoverage(): Promise<void> {
  if (existsSync(join(process.cwd(), coverageTempDir))) {
    await promises.rm(coverageTempDir, { recursive: true });
  }
  const directories = await readPackagesDirectory();
  const coverages = await mapCoverages(directories);
  coverages['integration'] = await readIntegrationCoverage();
  await promises.mkdir(join(process.cwd(), coverageTempDir));
  await writeCoveragesToSingleDir(coverages);
}

migrateCoverage();
