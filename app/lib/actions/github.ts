"use server";

import { prisma } from "@/lib/prisma";

export const addRepoToProject = async (
  githubRepo: any,
  currentUserId: string,
  description: string
) => {
  await prisma.repo.upsert({
    where: { id: githubRepo.id },
    update: {},
    create: {
      id: githubRepo.id,
      name: githubRepo.name,
      fullName: githubRepo.full_name,
      ownerLogin: githubRepo.owner.login,
      private: githubRepo.private,
      htmlUrl: githubRepo.html_url,
      description: githubRepo.description || description || "",
      cloneUrl: githubRepo.clone_url,
      sshUrl: githubRepo.ssh_url,
      defaultBranch: githubRepo.default_branch,
      language: githubRepo.language,
      visibility: githubRepo.visibility,
      createdAt: new Date(githubRepo.created_at),
      updatedAt: new Date(githubRepo.updated_at),
      pushedAt: new Date(githubRepo.pushed_at),
      size: githubRepo.size,
      stargazersCount: githubRepo.stargazers_count,
      watchersCount: githubRepo.watchers_count,
      forksCount: githubRepo.forks_count,
      openIssuesCount: githubRepo.open_issues_count,
      userId: currentUserId, // your local user id
    },
  });
};

export const deleteRepoProject = async (projectId: number) => {
  await prisma.repo.delete({
    where: { id: projectId },
  });
};

export const fetchUserRepos = async (userId: string) => {
  const repos = await prisma.repo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return repos;
};

export const fetchRepos = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {    
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
};


export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
  children?: GitHubFile[];
}

export async function fetchRepoTree(
  accessToken: string,
  owner: string,
  repo: string,
  path = ""
): Promise<GitHubFile[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch path: ${path}`);
  }

  const items = (await res.json()) as GitHubFile[];

  const withChildren = await Promise.all(
    items.map(async (item) => {
      if (item.type === "dir") {
        const children = await fetchRepoTree(
          accessToken,
          owner,
          repo,
          item.path
        );
        return { ...item, children };
      }
      return item;
    })
  );

  return withChildren;
}


export async function fetchGithubFileContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch file content");
  }

  const data = await res.json();

  if (data.encoding === "base64") {
    return atob(data.content);
  }

  return data.content;
}
