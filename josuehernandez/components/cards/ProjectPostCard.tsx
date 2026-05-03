import { ProjectPost } from "@/types";
import type { JSX } from "react";

export default function ProjectPostCard({
  post,
}: {
  post: ProjectPost;
}): JSX.Element {
  return (
    <article className="relative isolate flex flex-col gap-8 lg:flex-row">
      <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-64 lg:shrink-0">
        <img
          alt=""
          src={post.imageUrl}
          className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover dark:bg-gray-800"
        />
        <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
      </div>
      <div>
        <div className="flex items-center gap-x-4 text-xs">
          <time
            dateTime={post.datetime}
            className="text-gray-500 dark:text-gray-400"
          >
            {post.date}
          </time>
          <a
            href={post.category.href}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {post.category.title}
          </a>
        </div>
        <div className="group relative max-w-xl">
          <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
            <a href={post.href}>
              <span className="absolute inset-0" />
              {post.title}
            </a>
          </h3>
          <p className="mt-5 text-sm/6 text-gray-600 dark:text-gray-400">
            {post.description}
          </p>
        </div>
        <div className="mt-6 flex border-t border-gray-900/5 pt-6 dark:border-white/10">
          <div className="relative flex items-center gap-x-4">
            <img
              alt=""
              src={post.author.imageUrl}
              className="size-10 rounded-full bg-gray-50 dark:bg-gray-800"
            />
            <div className="text-sm/6">
              <p className="font-semibold text-gray-900 dark:text-white">
                <a href={post.author.href}>
                  <span className="absolute inset-0" />
                  {post.author.name}
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-400">{post.author.role}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
