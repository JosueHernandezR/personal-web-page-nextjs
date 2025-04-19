import { forwardRef, RefAttributes, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface OuterContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const OuterContainer = forwardRef<HTMLDivElement, OuterContainerProps>(
  function OuterContainer({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
        <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
      </div>
    );
  }
);

interface InnerContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const InnerContainer = forwardRef<HTMLDivElement, InnerContainerProps>(
  function InnerContainer({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
        {...props}
      >
        <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
      </div>
    );
  }
);

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

interface ContainerComponent extends React.ForwardRefExoticComponent<ContainerProps & RefAttributes<HTMLDivElement>> {
  Outer: typeof OuterContainer;
  Inner: typeof InnerContainer;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container({ children, ...props }, ref) {
  return (
    <OuterContainer ref={ref} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  );
}) as ContainerComponent;

Container.Outer = OuterContainer;
Container.Inner = InnerContainer;

export { Container };
