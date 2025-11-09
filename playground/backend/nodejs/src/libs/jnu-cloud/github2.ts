/** Github Advanced Operations
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 */

// & Import AREA
// &---------------------------------------------------------------------------
import Path from 'path';
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import { readJsonFromGithub } from './github.js';

// & Types AREA
// &---------------------------------------------------------------------------
type GithubAccount = {
  userName: string;
  fullName: string;
  email: string;
  token: string;
};

type RepoOptions = {
  name: string;
  userName?: string;
  description?: string;
  auto_init?: boolean;
  isPrivate?: boolean;
  license_template?: string;
};

type RepoGetOptions = {
  owner: string;
  repo: string;
};

type RepoListOrgOptions = {
  org: string;
  type?: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
};

type RepoBranchListOptions = {
  owner: string;
  repo: string;
  protectedOnly?: boolean;
  perPage?: number;
  page?: number;
};

type RepoCollaboratorListOptions = {
  owner: string;
  repo: string;
  affiliation?: 'all' | 'outside' | 'direct';
  perPage?: number;
  page?: number;
};

type IssueListOptions = {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  labels?: string[];
  assignee?: string;
  perPage?: number;
  page?: number;
};

type IssueCreateOptions = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
};

type IssueUpdateOptions = {
  owner: string;
  repo: string;
  issueNumber: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  labels?: string[];
  assignees?: string[];
  milestone?: number | null;
};

type IssueCommentListOptions = {
  owner: string;
  repo: string;
  issueNumber: number;
  perPage?: number;
  page?: number;
};

type IssueCommentCreateOptions = {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
};

type IssueCommentUpdateOptions = {
  owner: string;
  repo: string;
  commentId: number;
  body: string;
};

type IssueAssigneeOptions = {
  owner: string;
  repo: string;
  issueNumber: number;
  assignees: string[];
};

type ProjectOwnerType = 'user' | 'org';

type ProjectListOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  perPage?: number;
  query?: string;
};

type ProjectGetOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
};

type ProjectFieldListOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  perPage?: number;
};

type ProjectFieldGetOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  fieldId: number;
};

type ProjectItemListOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  perPage?: number;
  query?: string;
};

type ProjectItemGetOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  itemId: number;
};

type ProjectItemAddOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  itemId: number;
  itemType: 'issue' | 'pull_request';
};

type ProjectItemUpdateOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  itemId: number;
  updatedField: {
    id: number;
    value: any;
  };
};

type ProjectItemDeleteOptions = {
  ownerType: ProjectOwnerType;
  owner: string;
  projectNumber: number;
  itemId: number;
};

type WorkflowDispatchOptions = {
  owner: string;
  repo: string;
  workflowId: number | string;
  ref: string;
  inputs?: Record<string, any>;
};

type WorkflowListOptions = {
  owner: string;
  repo: string;
  perPage?: number;
  page?: number;
};

type WorkflowRunsOptions = {
  owner: string;
  repo: string;
  workflowId?: number | string;
  branch?: string;
  status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting';
  perPage?: number;
  page?: number;
};

type GithubConfig = {
  owner: string;
  repo: string;
  token: string;
};

type PullRequestListOptions = {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  head?: string;
  base?: string;
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
};

type PullRequestCreateOptions = {
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
  body?: string;
  draft?: boolean;
  maintainerCanModify?: boolean;
};

type PullRequestUpdateOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
  maintainerCanModify?: boolean;
};

type PullRequestMergeOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  commitTitle?: string;
  commitMessage?: string;
  mergeMethod?: 'merge' | 'squash' | 'rebase';
  sha?: string;
};

type PullRequestReviewListOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  perPage?: number;
  page?: number;
};

type PullRequestReviewCreateOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  body?: string;
  comments?: Array<{
    path: string;
    body: string;
    position?: number;
    line?: number;
    side?: 'LEFT' | 'RIGHT';
    startLine?: number;
    startSide?: 'LEFT' | 'RIGHT';
  }>;
};

type PullRequestReviewSubmitOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  reviewId: number;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  body?: string;
};

type PullRequestFilesListOptions = {
  owner: string;
  repo: string;
  pullNumber: number;
  perPage?: number;
  page?: number;
};

// & Helper Functions
// &---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const exec = (cmd: string, options: any = {}) => {
  let { wait = 0, msg = '', echo = true } = options;
  if (echo) {
    msg = msg || cmd;
    console.log(`Command: ${msg}`);
  }
  try {
    execSync(cmd);
    if (wait > 0) {
      sleep(wait);
    }
  } catch (error) {
    console.log('EXEC Error: ', error);
  }
};

// & Functions AREA
// &---------------------------------------------------------------------------

/**
 * Github 계정 정보 조회
 * @param userName - Github 사용자명
 * @param githubConfig - Github 설정 정보
 * @returns Github 계정 정보
 *
 * @example
 * ```ts
 * const account = await findGithubAccount('username', githubConfig);
 * ```
 */
const findGithubAccount = async (
  userName: string,
  githubConfig: GithubConfig
): Promise<GithubAccount | undefined> => {
  try {
    const res = await readJsonFromGithub<Record<string, GithubAccount>>('Apis/github.json', githubConfig);
    const account = res?.[userName];
    if (account) {
      account.userName = account.userName ?? userName;
    }
    return account;
  } catch (error) {
    console.error('GitHub 계정 정보를 가져오는 중 오류가 발생했습니다:', error);
    // 환경변수에서 직접 가져오기 시도
    if (process.env.ENV_GITHUB_OWNER && process.env.ENV_GITHUB_TOKEN) {
      return {
        userName: process.env.ENV_GITHUB_OWNER,
        fullName: process.env.ENV_GITHUB_OWNER,
        email: process.env.ENV_GITHUB_EMAIL ?? '',
        token: process.env.ENV_GITHUB_TOKEN,
      };
    }
    return undefined;
  }
};

/**
 * Github 사용자 목록 조회
 * @param githubConfig - Github 설정 정보
 * @returns Github 사용자 목록
 */
const findAllUsers = async (githubConfig: GithubConfig): Promise<Record<string, GithubAccount> | undefined> => {
  try {
    const res = await readJsonFromGithub<Record<string, GithubAccount>>('Apis/github.json', githubConfig);
    return res ?? undefined;
  } catch (error) {
    console.error('GitHub 사용자 목록을 가져오는 중 오류가 발생했습니다:', error);
    return undefined;
  }
};

/**
 * 사용자 전체 목록 중 이름 또는 이메일로 계정을 검색
 * @param name - fullName 또는 userName 기준 검색 문자열
 * @param githubConfig - Github 설정 정보
 * @returns 일치하는 GithubAccount 또는 undefined
 */
const findUserByName = async (name: string, githubConfig: GithubConfig): Promise<GithubAccount | undefined> => {
  const allUsers = await findAllUsers(githubConfig);
  if (!allUsers) {
    return undefined;
  }

  const lowerName = name.trim().toLowerCase();
  for (const [key, account] of Object.entries(allUsers)) {
    const userNameMatch = key.toLowerCase() === lowerName;
    const accountUserMatch = (account.userName ?? '').toLowerCase() === lowerName;
    const fullNameMatch = (account.fullName ?? '').toLowerCase() === lowerName;
    const emailMatch = (account.email ?? '').toLowerCase() === lowerName;

    if (userNameMatch || accountUserMatch || fullNameMatch || emailMatch) {
      const resolvedAccount: GithubAccount = {
        userName: account.userName ?? key,
        fullName: account.fullName ?? key,
        email: account.email ?? '',
        token: account.token,
      };
      return resolvedAccount;
    }
  }

  return undefined;
};

/**
 * 모든 저장소 목록 조회
 */
const findAllRepos = async (octokit: Octokit) => {
  try {
    const response = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'updated',
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * 특정 저장소 상세 조회
 */
const getRepo = async (octokit: Octokit, options: RepoGetOptions) => {
  const { owner, repo } = options;
  const response = await octokit.rest.repos.get({
    owner,
    repo,
  });
  return response.data;
};

/**
 * 조직 내 저장소 목록 조회
 */
const listOrgRepos = async (octokit: Octokit, options: RepoListOrgOptions) => {
  const { org, type = 'all', sort = 'full_name', direction = 'asc', perPage = 30, page = 1 } = options;
  const response = await octokit.rest.repos.listForOrg({
    org,
    type,
    sort,
    direction,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 저장소 브랜치 목록 조회
 */
const listRepoBranches = async (octokit: Octokit, options: RepoBranchListOptions) => {
  const { owner, repo, protectedOnly, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.repos.listBranches({
    owner,
    repo,
    protected: protectedOnly ? true : undefined,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 저장소 협업자 목록 조회
 */
const listRepoCollaborators = async (octokit: Octokit, options: RepoCollaboratorListOptions) => {
  const { owner, repo, affiliation = 'all', perPage = 30, page = 1 } = options;
  const response = await octokit.rest.repos.listCollaborators({
    owner,
    repo,
    affiliation,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 새 저장소 생성
 */
const createRemoteRepo = async (octokit: Octokit, options: RepoOptions) => {
  console.log('createRemoteRepo options: ', options);
  const { name, description, isPrivate } = options;

  return await octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: true,
  });
};

/**
 * 저장소 삭제
 */
const deleteRemoteRepo = async (octokit: Octokit, options: RepoOptions, account: GithubAccount) => {
  const { name } = options;
  console.log(`deleteRemoteRepo: ${name}`);
  return await octokit.rest.repos.delete({
    owner: account.userName,
    repo: name,
  });
};

/**
 * Git 설정 변경
 */
const setLocalConfig = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  let cmd = `cd ${localPath} && git config user.name "${account.fullName}"`;
  cmd += ` && git config user.email "${account.email}"`;
  cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  exec(cmd);
};

/**
 * 로컬 저장소 초기화
 */
const initLocalRepo = async (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const { name } = options;
  const { fullName, email, token, userName } = account;

  exec(`cd ${localPath} && git init && git config --global --add safe.directory ${localPath}`, { wait: 1000 });

  try {
    exec(`cd ${localPath} && git branch -m master main`, { wait: 2000 });
  } catch (error) {
    console.log('Branch rename error: ', error);
  }

  let cmd = `cd ${localPath} && git config user.name "${fullName}"`;
  cmd += ` && git config user.email "${email}"`;
  cmd += ` && git remote add origin https://${token}@github.com/${userName}/${name}.git`;
  const commitMessage = options.description || 'Initial commit';
  cmd += ` && git add . && git commit -m "${commitMessage}"`;
  exec(cmd, { wait: 10000 });
};

/**
 * 저장소 복제
 */
const cloneRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const cmd = `cd ${Path.dirname(localPath)} && git clone https://${account.token}@github.com/${account.userName}/${
    options.name
  }.git`;
  exec(cmd);
};

/**
 * 저장소 복제 및 설정
 */
const copyRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  cloneRepo(options, account, localPath);
  sleep(10000);
  setLocalConfig(options, account, localPath);
};

/**
 * 저장소에 변경사항 푸시
 */
const pushRepo = (_options: RepoOptions, _account: GithubAccount, localPath: string) => {
  // 변경사항이 있는지 확인
  const status = execSync(`cd ${localPath} && git status --porcelain`, { encoding: 'utf8' });

  // 변경사항이 있으면 커밋
  if (status.length > 0) {
    const commitMessage = _options.description || 'Initial commit';
    const cmd = `cd ${localPath} && git add . && git commit -m "${commitMessage}"`;
    exec(cmd, { msg: `pushRepo ${cmd}` });
  }

  const branches = execSync(`cd ${localPath} && git branch`);
  console.log(`pushRepo branches: ${branches}`);

  if (branches.includes('main')) {
    exec(`cd ${localPath} && git push -u origin main --force`);
  } else if (branches.includes('master')) {
    exec(`cd ${localPath} && git push -u origin master --force`);
  } else {
    console.log('main 또는 master 브랜치가 없습니다.');
  }
};

/**
 * 새 저장소 생성 및 초기 커밋
 */
const makeRepo = async (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  console.log('makeRepo options: ', JSON.stringify(options));

  // 원격 저장소 생성
  await createRemoteRepo(octokit, options);
  await sleep(10000);

  // 로컬 저장소 초기화
  console.log(`initLocalRepo: ${localPath}`);
  await initLocalRepo(options, account, localPath);
  await sleep(15000);

  // 초기 커밋 및 푸시
  console.log(`pushRepo: ${localPath}`);
  pushRepo(options, account, localPath);
};

/**
 * 로컬 + 원격 저장소 삭제
 */
const removeRepo = async (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  await deleteRemoteRepo(octokit, options, account);
  await sleep(10000);

  const { name } = options;
  const platform = process.platform;

  if (platform === 'win32') {
    try {
      const cdCmd = `cd ${Path.dirname(localPath)}`;
      exec(cdCmd);

      const rmCmd = `rmdir /s /q ${name}`;
      exec(rmCmd);
    } catch (error) {
      console.error('Failed to remove directory:', error);
      try {
        const altCmd = `rd /s /q "${localPath}"`;
        exec(altCmd);
      } catch (err) {
        console.error('Alternative removal also failed:', err);
      }
    }
  } else {
    const cmd = `cd ${Path.dirname(localPath)} && rm -rf ${name}`;
    exec(cmd);
  }
};

/**
 * 저장소에서 최신 변경사항을 가져오기 (pull)
 */
const pullRepo = (_options: RepoOptions, _account: GithubAccount, localPath: string) => {
  try {
    const currentBranch = execSync(`cd ${localPath} && git rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();
    console.log(`📥 Pulling latest changes from ${currentBranch} branch...`);

    const cmd = `cd ${localPath} && git pull origin ${currentBranch}`;
    exec(cmd, { msg: `pullRepo: ${cmd}` });

    console.log('✅ Pull completed successfully!');
  } catch (error) {
    console.error('❌ Pull failed:', error);
    throw error;
  }
};

/**
 * 로컬과 원격 저장소 동기화 (sync)
 */
const syncRepo = (options: RepoOptions, _account: GithubAccount, localPath: string) => {
  try {
    console.log('🔄 Starting repository synchronization...');

    const currentBranch = execSync(`cd ${localPath} && git rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();
    console.log(`📍 Current branch: ${currentBranch}`);

    const status = execSync(`cd ${localPath} && git status --porcelain`, { encoding: 'utf8' });

    if (status.length > 0) {
      console.log('📝 Local changes detected, committing...');
      const commitMessage = options.description || `Auto-sync: ${new Date().toISOString()}`;
      const commitCmd = `cd ${localPath} && git add . && git commit -m "${commitMessage}"`;
      exec(commitCmd, { msg: `syncRepo commit: ${commitCmd}` });
    } else {
      console.log('📋 No local changes to commit');
    }

    console.log('📥 Fetching from remote...');
    exec(`cd ${localPath} && git fetch origin ${currentBranch}`, { msg: 'syncRepo fetch' });

    try {
      const ahead = execSync(`cd ${localPath} && git rev-list --count HEAD..origin/${currentBranch}`, { encoding: 'utf8' }).trim();
      const behind = execSync(`cd ${localPath} && git rev-list --count origin/${currentBranch}..HEAD`, { encoding: 'utf8' }).trim();

      console.log(`📊 Repository status: ${behind} commits ahead, ${ahead} commits behind`);

      if (parseInt(ahead) > 0) {
        console.log('📥 Pulling remote changes...');
        exec(`cd ${localPath} && git pull origin ${currentBranch}`, { msg: 'syncRepo pull' });
      }

      if (parseInt(behind) > 0) {
        console.log('📤 Pushing local changes...');
        exec(`cd ${localPath} && git push origin ${currentBranch}`, { msg: 'syncRepo push' });
      }

      if (parseInt(ahead) === 0 && parseInt(behind) === 0) {
        console.log('✅ Repository is already up to date!');
      } else {
        console.log('✅ Synchronization completed successfully!');
      }

    } catch (error) {
      console.log('📤 Pushing to remote (first time)...');
      exec(`cd ${localPath} && git push -u origin ${currentBranch}`, { msg: 'syncRepo initial push' });
      console.log('✅ Initial push completed successfully!');
    }

  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
};

/**
 * 저장소 이슈 목록 조회
 */
const listRepoIssues = async (octokit: Octokit, options: IssueListOptions) => {
  const { owner, repo, state = 'open', labels, assignee, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state,
    labels: labels && labels.length > 0 ? labels.join(',') : undefined,
    assignee,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 저장소 이슈 생성
 */
const createRepoIssue = async (octokit: Octokit, options: IssueCreateOptions) => {
  const { owner, repo, title, body, labels, assignees, milestone } = options;
  const response = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels,
    assignees,
    milestone,
  });
  return response.data;
};

/**
 * 저장소 이슈 업데이트
 */
const updateRepoIssue = async (octokit: Octokit, options: IssueUpdateOptions) => {
  const { owner, repo, issueNumber, title, body, state, labels, assignees, milestone } = options;
  const response = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    title,
    body,
    state,
    labels,
    assignees,
    milestone,
  });
  return response.data;
};

/**
 * 저장소 이슈 댓글 목록 조회
 */
const listIssueComments = async (octokit: Octokit, options: IssueCommentListOptions) => {
  const { owner, repo, issueNumber, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 저장소 이슈 댓글 생성
 */
const createIssueComment = async (octokit: Octokit, options: IssueCommentCreateOptions) => {
  const { owner, repo, issueNumber, body } = options;
  const response = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
  return response.data;
};

/**
 * 저장소 이슈 댓글 수정
 */
const updateIssueComment = async (octokit: Octokit, options: IssueCommentUpdateOptions) => {
  const { owner, repo, commentId, body } = options;
  const response = await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
  });
  return response.data;
};

/**
 * 저장소 이슈 담당자 추가
 */
const addIssueAssignees = async (octokit: Octokit, options: IssueAssigneeOptions) => {
  const { owner, repo, issueNumber, assignees } = options;
  const response = await octokit.rest.issues.addAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees,
  });
  return response.data;
};

/**
 * 저장소 이슈 담당자 제거
 */
const removeIssueAssignees = async (octokit: Octokit, options: IssueAssigneeOptions) => {
  const { owner, repo, issueNumber, assignees } = options;
  const response = await octokit.rest.issues.removeAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees,
  });
  return response.data;
};

const PROJECTS_ACCEPT_HEADER = 'application/vnd.github+json';

const resolveProjectRoute = (ownerType: ProjectOwnerType, owner: string) => {
  if (ownerType === 'org') {
    return {
      base: '/orgs/{org}/projectsV2',
      params: { org: owner },
    };
  }
  return {
    base: '/users/{username}/projectsV2',
    params: { username: owner },
  };
};

const mapProjectItemType = (itemType: ProjectItemAddOptions['itemType']) => {
  return itemType === 'issue' ? 'Issue' : 'PullRequest';
};

/**
 * 프로젝트 목록 조회 (Projects V2)
 */
const listProjects = async (octokit: Octokit, options: ProjectListOptions) => {
  const { ownerType, owner, perPage, query } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const requestParams: Record<string, any> = {
    ...params,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  };
  if (typeof perPage === 'number') {
    requestParams.per_page = perPage;
  }
  if (query) {
    requestParams.q = query;
  }
  const response = await octokit.request(`GET ${base}`, requestParams);
  return response.data;
};

/**
 * 프로젝트 상세 조회 (Projects V2)
 */
const getProject = async (octokit: Octokit, options: ProjectGetOptions) => {
  const { ownerType, owner, projectNumber } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const response = await octokit.request(`GET ${base}/{project_number}`, {
    ...params,
    project_number: projectNumber,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  });
  return response.data;
};

/**
 * 프로젝트 필드 목록 조회 (Projects V2)
 */
const listProjectFields = async (octokit: Octokit, options: ProjectFieldListOptions) => {
  const { ownerType, owner, projectNumber, perPage } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const requestParams: Record<string, any> = {
    ...params,
    project_number: projectNumber,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  };
  if (typeof perPage === 'number') {
    requestParams.per_page = perPage;
  }
  const response = await octokit.request(`GET ${base}/{project_number}/fields`, requestParams);
  return response.data;
};

/**
 * 프로젝트 필드 상세 조회 (Projects V2)
 */
const getProjectField = async (octokit: Octokit, options: ProjectFieldGetOptions) => {
  const { ownerType, owner, projectNumber, fieldId } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const response = await octokit.request(`GET ${base}/{project_number}/fields/{field_id}`, {
    ...params,
    project_number: projectNumber,
    field_id: fieldId,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  });
  return response.data;
};

/**
 * 프로젝트 아이템 목록 조회 (Projects V2)
 */
const listProjectItems = async (octokit: Octokit, options: ProjectItemListOptions) => {
  const { ownerType, owner, projectNumber, perPage, query } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const requestParams: Record<string, any> = {
    ...params,
    project_number: projectNumber,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  };
  if (typeof perPage === 'number') {
    requestParams.per_page = perPage;
  }
  if (query) {
    requestParams.q = query;
  }
  const response = await octokit.request(`GET ${base}/{project_number}/items`, requestParams);
  return response.data;
};

/**
 * 프로젝트 아이템 상세 조회 (Projects V2)
 */
const getProjectItem = async (octokit: Octokit, options: ProjectItemGetOptions) => {
  const { ownerType, owner, projectNumber, itemId } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const response = await octokit.request(`GET ${base}/{project_number}/items/{item_id}`, {
    ...params,
    project_number: projectNumber,
    item_id: itemId,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  });
  return response.data;
};

/**
 * 프로젝트에 이슈/PR 아이템 추가 (Projects V2)
 */
const addProjectItem = async (octokit: Octokit, options: ProjectItemAddOptions) => {
  const { ownerType, owner, projectNumber, itemId, itemType } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const response = await octokit.request(`POST ${base}/{project_number}/items`, {
    ...params,
    project_number: projectNumber,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
    id: itemId,
    type: mapProjectItemType(itemType),
  });
  return response.data;
};

/**
 * 프로젝트 아이템 필드 업데이트 (Projects V2)
 */
const updateProjectItem = async (octokit: Octokit, options: ProjectItemUpdateOptions) => {
  const { ownerType, owner, projectNumber, itemId, updatedField } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  const response = await octokit.request(`PATCH ${base}/{project_number}/items/{item_id}`, {
    ...params,
    project_number: projectNumber,
    item_id: itemId,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
    fields: [
      {
        id: updatedField.id,
        value: updatedField.value,
      },
    ],
  });
  return response.data;
};

/**
 * 프로젝트 아이템 삭제 (Projects V2)
 */
const deleteProjectItem = async (octokit: Octokit, options: ProjectItemDeleteOptions) => {
  const { ownerType, owner, projectNumber, itemId } = options;
  const { base, params } = resolveProjectRoute(ownerType, owner);
  await octokit.request(`DELETE ${base}/{project_number}/items/{item_id}`, {
    ...params,
    project_number: projectNumber,
    item_id: itemId,
    headers: { accept: PROJECTS_ACCEPT_HEADER },
  });
};

/**
 * 풀 리퀘스트 목록 조회
 */
const listPullRequests = async (octokit: Octokit, options: PullRequestListOptions) => {
  const { owner, repo, state = 'open', head, base, sort = 'created', direction = 'desc', perPage = 30, page = 1 } = options;
  const response = await octokit.rest.pulls.list({
    owner,
    repo,
    state,
    head,
    base,
    sort,
    direction,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 생성
 */
const createPullRequest = async (octokit: Octokit, options: PullRequestCreateOptions) => {
  const { owner, repo, title, head, base, body, draft, maintainerCanModify } = options;
  const response = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
    body,
    draft,
    maintainer_can_modify: maintainerCanModify,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 수정
 */
const updatePullRequest = async (octokit: Octokit, options: PullRequestUpdateOptions) => {
  const { owner, repo, pullNumber, title, body, state, base, maintainerCanModify } = options;
  const response = await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: pullNumber,
    title,
    body,
    state,
    base,
    maintainer_can_modify: maintainerCanModify,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 병합
 */
const mergePullRequest = async (octokit: Octokit, options: PullRequestMergeOptions) => {
  const { owner, repo, pullNumber, commitTitle, commitMessage, mergeMethod, sha } = options;
  const response = await octokit.rest.pulls.merge({
    owner,
    repo,
    pull_number: pullNumber,
    commit_title: commitTitle,
    commit_message: commitMessage,
    merge_method: mergeMethod,
    sha,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 리뷰 목록 조회
 */
const listPullRequestReviews = async (octokit: Octokit, options: PullRequestReviewListOptions) => {
  const { owner, repo, pullNumber, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pull_number: pullNumber,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 리뷰 생성 (초안 상태)
 */
const createPullRequestReview = async (octokit: Octokit, options: PullRequestReviewCreateOptions) => {
  const { owner, repo, pullNumber, event, body, comments } = options;
  const payloadComments =
    comments?.map((comment) => ({
      path: comment.path,
      body: comment.body,
      position: comment.position,
      line: comment.line,
      side: comment.side,
      start_line: comment.startLine,
      start_side: comment.startSide,
    })) ?? undefined;

  const response = await octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    event,
    body,
    comments: payloadComments,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 리뷰 제출
 */
const submitPullRequestReview = async (octokit: Octokit, options: PullRequestReviewSubmitOptions) => {
  const { owner, repo, pullNumber, reviewId, event, body } = options;
  const response = await octokit.rest.pulls.submitReview({
    owner,
    repo,
    pull_number: pullNumber,
    review_id: reviewId,
    event,
    body,
  });
  return response.data;
};

/**
 * 풀 리퀘스트 변경 파일 목록 조회
 */
const listPullRequestFiles = async (octokit: Octokit, options: PullRequestFilesListOptions) => {
  const { owner, repo, pullNumber, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
    per_page: perPage,
    page,
  });
  return response.data;
};

/**
 * 저장소 워크플로 목록 조회
 */
const listRepoWorkflows = async (octokit: Octokit, options: WorkflowListOptions) => {
  const { owner, repo, perPage = 30, page = 1 } = options;
  const response = await octokit.rest.actions.listRepoWorkflows({
    owner,
    repo,
    per_page: perPage,
    page,
  });
  return response.data.workflows;
};

/**
 * 워크플로 실행 이력 조회
 */
const listWorkflowRuns = async (octokit: Octokit, options: WorkflowRunsOptions) => {
  const { owner, repo, workflowId, branch, status, perPage = 30, page = 1 } = options;
  if (workflowId) {
    const response = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflowId,
      branch,
      status,
      per_page: perPage,
      page,
    });
    return response.data.workflow_runs;
  }
  const response = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    branch,
    status,
    per_page: perPage,
    page,
  });
  return response.data.workflow_runs;
};

/**
 * 워크플로 수동 실행
 */
const dispatchWorkflow = async (octokit: Octokit, options: WorkflowDispatchOptions) => {
  const { owner, repo, workflowId, ref, inputs } = options;
  await octokit.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id: workflowId,
    ref,
    inputs,
  });
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  // Types
  type GithubAccount,
  type RepoOptions,
  type RepoGetOptions,
  type RepoListOrgOptions,
  type RepoBranchListOptions,
  type RepoCollaboratorListOptions,
  type IssueListOptions,
  type IssueCreateOptions,
  type IssueUpdateOptions,
  type IssueCommentListOptions,
  type IssueCommentCreateOptions,
  type IssueCommentUpdateOptions,
  type IssueAssigneeOptions,
  type ProjectOwnerType,
  type ProjectListOptions,
  type ProjectGetOptions,
  type ProjectFieldListOptions,
  type ProjectFieldGetOptions,
  type ProjectItemListOptions,
  type ProjectItemGetOptions,
  type ProjectItemAddOptions,
  type ProjectItemUpdateOptions,
  type ProjectItemDeleteOptions,
  type PullRequestListOptions,
  type PullRequestCreateOptions,
  type PullRequestUpdateOptions,
  type PullRequestMergeOptions,
  type PullRequestReviewListOptions,
  type PullRequestReviewCreateOptions,
  type PullRequestReviewSubmitOptions,
  type PullRequestFilesListOptions,
  type WorkflowDispatchOptions,
  type WorkflowListOptions,
  type WorkflowRunsOptions,
  type GithubConfig,
  // Account Functions
  findGithubAccount,
  findAllUsers,
  findUserByName,
  // Repository Functions
  findAllRepos,
  getRepo,
  listOrgRepos,
  listRepoBranches,
  listRepoCollaborators,
  createRemoteRepo,
  deleteRemoteRepo,
  cloneRepo,
  setLocalConfig,
  initLocalRepo,
  copyRepo,
  pushRepo,
  makeRepo,
  removeRepo,
  pullRepo,
  syncRepo,
  // Issue Functions
  listRepoIssues,
  createRepoIssue,
  updateRepoIssue,
  listIssueComments,
  createIssueComment,
  updateIssueComment,
  addIssueAssignees,
  removeIssueAssignees,
  // Project Functions
  listProjects,
  getProject,
  listProjectFields,
  getProjectField,
  listProjectItems,
  getProjectItem,
  addProjectItem,
  updateProjectItem,
  deleteProjectItem,
  // Pull Request Functions
  listPullRequests,
  createPullRequest,
  updatePullRequest,
  mergePullRequest,
  listPullRequestReviews,
  createPullRequestReview,
  submitPullRequestReview,
  listPullRequestFiles,
  // Workflow Functions
  listRepoWorkflows,
  listWorkflowRuns,
  dispatchWorkflow,
};
