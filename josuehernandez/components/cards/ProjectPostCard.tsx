import { ProjectPost } from "@/types";
import type { JSX } from "react";
import ProjectGlowThumbnail from "./ProjectGlowThumbnail";
import ProjectGlowImageFrame from "./ProjectGlowImageFrame";

export default function ProjectPostCard({
  post,
}: {
  post: ProjectPost;
}): JSX.Element {
  return (
    <article className="relative isolate">
      <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:min-h-72 lg:flex-row lg:items-stretch lg:gap-10">
        <figure className="relative flex min-h-48 w-full min-w-0 shrink-0 flex-col sm:min-h-56 lg:max-w-[min(46%,26rem)]">
          {/* keys + frame propios por post: evita que el navegador reutilice texturas/filter entre halos */}
          <ProjectGlowImageFrame postId={post.id}>
            <div className="relative max-h-[min(24rem,72vw)] w-full min-h-48 min-w-0 flex-1 overflow-hidden rounded-[inherit] aspect-video sm:max-h-[min(26rem,58vw)] sm:min-h-56 sm:aspect-4/3 lg:aspect-auto lg:max-h-none lg:min-h-64">
              <ProjectGlowThumbnail
                src={post.imageUrl}
                alt=""
                isolationId={post.id}
              />
            </div>
          </ProjectGlowImageFrame>
        </figure>
        <div className="min-w-0 flex-1 lg:py-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <time
              dateTime={post.datetime}
              className="text-gray-500 dark:text-gray-400"
            >
              {post.date}
            </time>
            <a
              href={post.category.href}
              className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 ring-1 ring-gray-900/10 hover:bg-gray-100 dark:bg-zinc-800/60 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-zinc-800"
            >
              {post.category.title}
            </a>
          </div>
          <div className="group relative mt-3 max-w-xl">
            <h3 className="text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
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
                className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-gray-900/10 dark:bg-zinc-800 dark:ring-white/15"
              />
              <div className="text-sm/6">
                <p className="font-semibold text-gray-900 dark:text-white">
                  <a href={post.author.href}>
                    <span className="absolute inset-0" />
                    {post.author.name}
                  </a>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {post.author.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
