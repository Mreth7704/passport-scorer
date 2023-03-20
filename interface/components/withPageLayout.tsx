import React, { useState, useCallback } from "react";

import Header from "./Header";
import Footer from "./Footer";
import PageWidthGrid from "./PageWidthGrid";

export const PAGE_PADDING = "px-4 md:px-20";
export const FOOTER_HEIGHT = "h-[120px]";
export const CONTENT_MAX_WIDTH_INCLUDING_PADDING = "max-w-[1440px]";
const CONTENT_MAX_WIDTH = "max-w-screen-xl";

export const HeaderContentFooterGrid = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="grid h-full min-h-default w-full grid-cols-1 grid-rows-[auto_1fr_auto]">
    {children}
  </div>
);

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="font-libre-franklin text-gray-400">{children}</div>
);

export const withHomePageLayout = (PageComponent: React.ComponentType) => {
  const WrappedComponent = (props: any) => (
    <GlobalLayout>
      <div className="bg-purple-darkpurple">
        <HeaderContentFooterGrid>
          <Header mode="dark" className={PAGE_PADDING} />
          <PageWidthGrid className="mt-6 h-full">
            <PageComponent {...props} />
          </PageWidthGrid>
          <Footer mode="dark" className={PAGE_PADDING + " " + FOOTER_HEIGHT} />
        </HeaderContentFooterGrid>
      </div>
    </GlobalLayout>
  );

  WrappedComponent.displayName = "withHomePageLayout";
  return WrappedComponent;
};

export type TopLevelPageParams = {
  onUserError: (error: string | null) => void;
  generateHeader: (Subheader?: React.ComponentType) => React.ComponentType;
  generateFooter: (FooterOverride?: React.ComponentType) => React.ComponentType;
};

// This is the way to use generics w/ arrow functions
const withPageLayout = <P,>(PageComponent: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => {
    const [error, setError] = useState<string | null>(null);

    const generateHeader = useCallback(
      (Subheader?: React.ComponentType) => {
        return () => (
          <div className={"border-b border-gray-300 bg-white " + PAGE_PADDING}>
            <Header className="border-b border-b-gray-200 bg-white" />
            <div className={"mx-auto w-full " + CONTENT_MAX_WIDTH}>
              <div className="w-full bg-red-100">{error}</div>
              {Subheader && <Subheader />}
            </div>
          </div>
        );
      },
      [error]
    );

    const generateFooter = useCallback(
      (FooterOverride?: React.ComponentType) => {
        const CurrentFooter = FooterOverride || Footer;
        return () => (
          <CurrentFooter className={PAGE_PADDING + " " + FOOTER_HEIGHT} />
        );
      },
      []
    );

    return (
      <GlobalLayout>
        <div className="bg-gray-bluegray">
          <HeaderContentFooterGrid>
            <PageComponent
              {...props}
              onUserError={setError}
              generateHeader={generateHeader}
              generateFooter={generateFooter}
            />
          </HeaderContentFooterGrid>
        </div>
      </GlobalLayout>
    );
  };
  WrappedComponent.displayName = "withPageLayout";
  return WrappedComponent;
};

export default withPageLayout;
