import { logger } from 'flex-dev-utils';
import paths from '../utils/paths';

const GITHUB_FEATURE_REQUEST = 'https://bit.ly/2UMdbbj';

/**
 * Prints the errors when a build has failed to compile
 */
export default (errors: any[]) => {
  errors = errors || [];
  if (!errors.length) {
    errors = [errors];
  }

  const pkgName = logger.colors.red.bold(paths.packageName);
  logger.error(`Failed to compile plugin ${pkgName}.`);
  logger.newline();

  errors.forEach((error, index) => {
    const title = logger.colors.bold(`Error ${index + 1}`);
    logger.info(`${title}:`);
    if (typeof error === 'string') {
      logError(error);
    }
    if (typeof error === 'object') {
      logError(error.message);
    }

    logger.newline();
  });
}

/**
 * Logs the error line ; tries to parse and print useful information based on the error
 * @param error the error line
 */
const logError = (error: string) => {
  logger.info(error);

  if (error.indexOf('You may need an appropriate loader') !== -1) {
    const link = logger.coloredStrings.link(GITHUB_FEATURE_REQUEST);
    logger.newline();
    logger.notice(`You may file a feature request on GitHub (${link}) so we can add this loader.`);
  }
};
