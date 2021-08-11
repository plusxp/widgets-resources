import { GUID } from "mendix";
import { createElement, ReactElement, ReactNode } from "react";
import { mount, ReactWrapper } from "enzyme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TreeView, TreeViewProps } from "../TreeView";

const items: TreeViewProps["items"] = [
    { id: "11" as GUID, value: "First header", content: <div>First content</div> },
    { id: "22" as GUID, value: "Second header", content: <div>Second content</div> },
    { id: "33" as GUID, value: "Third header", content: <div>Third content</div> }
];

const defaultProps: TreeViewProps = {
    name: "",
    class: "",
    items: [],
    isUserDefinedLeafNode: false,
    shouldLazyLoad: false,
    startExpanded: false,
    showCustomIcon: false,
    iconPlacement: "right",
    expandIcon: null,
    collapseIcon: null
};

describe("TreeView", () => {
    it("shows everything properly when starting expanded", () => {
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={items} isUserDefinedLeafNode={false} startExpanded />
        );

        // There is not really another way to properly identify that we're dealing with tree view branches.
        const treeViewBranches = treeView.find(".widget-tree-view-branch");
        expect(treeViewBranches).toHaveLength(items.length);

        expect(treeViewBranches.at(0).text()).toContain("First header");
        expect(treeViewBranches.at(1).text()).toContain("Second header");
        expect(treeViewBranches.at(2).text()).toContain("Third header");

        expect(treeViewBranches.at(0).text()).toContain("First content");
        expect(treeViewBranches.at(1).text()).toContain("Second content");
        expect(treeViewBranches.at(2).text()).toContain("Third content");
    });

    it("does not show the tree view item content when not starting expanded", () => {
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={items} isUserDefinedLeafNode={false} startExpanded={false} />
        );

        // There is not really another way to properly identify that we're dealing with tree view branches.
        const treeViewBranches = treeView.find(".widget-tree-view-branch");
        expect(treeViewBranches).toHaveLength(items.length);

        expect(treeViewBranches.at(0).text()).toContain("First header");
        expect(treeViewBranches.at(1).text()).toContain("Second header");
        expect(treeViewBranches.at(2).text()).toContain("Third header");

        expect(treeViewBranches.at(0).text()).not.toContain("First content");
        expect(treeViewBranches.at(1).text()).not.toContain("Second content");
        expect(treeViewBranches.at(2).text()).not.toContain("Third content");
    });

    it("handles tree headers properly even if they are composed with widgets", () => {
        const newItems = [
            ...items,
            { id: "44" as GUID, value: <div>This is the 44 header</div>, content: <div>Fourth content</div> }
        ];
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={newItems} isUserDefinedLeafNode={false} startExpanded />
        );

        // There is not really another way to properly identify that we're dealing with tree view branches.
        const treeViewBranches = treeView.find(".widget-tree-view-branch");
        expect(treeViewBranches).toHaveLength(newItems.length);

        expect(treeViewBranches.at(3).html()).toContain("<div>This is the 44 header</div>");
        expect(treeViewBranches.at(3).text()).toContain("Fourth content");
    });

    it("shows the tree view headers in the correct order as a button when not defined as a leaf node", () => {
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={items} isUserDefinedLeafNode={false} startExpanded={false} />
        );

        const treeViewHeaders = treeView.find('[role="button"]');

        expect(treeViewHeaders).toHaveLength(items.length);
        items.forEach(item => {
            expect(treeView.text()).toContain(item.value);
        });
    });

    it("does render the tree view headers as a button even when defined as a leaf node", () => {
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={items} isUserDefinedLeafNode startExpanded={false} />
        );

        const treeViewHeaders = treeView.find('[role="button"]');

        expect(treeViewHeaders).toHaveLength(3);
        items.forEach(item => {
            expect(treeView.text()).toContain(item.value);
        });
    });

    it("correctly collapses and expands the tree view branch content when clicking on the header", () => {
        const treeView = mount(
            <TreeView {...defaultProps} class="" items={items} isUserDefinedLeafNode={false} startExpanded={false} />
        );

        expect(treeView.text()).not.toContain("Second content");

        const treeViewHeaders = treeView.find('[role="button"]');
        expect(treeViewHeaders).toHaveLength(3);

        const secondTreeViewHeader = treeViewHeaders.at(1);
        // expand
        secondTreeViewHeader.simulate("click");
        expect(treeView.text()).toContain("Second content");

        // collapse
        secondTreeViewHeader.simulate("click");
        expect(treeView.text()).not.toContain("Second content");
    });

    const customIconProps: Partial<TreeViewProps> = {
        showCustomIcon: true,
        expandIcon: { type: "glyph", iconClass: "expand-icon" },
        collapseIcon: { type: "image", iconUrl: "collapse-image" }
    };

    function getExpandIconFromBranchHeader(header: ReactWrapper<any>): ReactWrapper<any> {
        return header.findWhere(
            node => node.type() === "span" && node.hasClass("glyphicon") && node.hasClass("expand-icon")
        );
    }

    function getCollapseImageFromBranchHeader(header: ReactWrapper<any>): ReactWrapper<any> {
        return header.findWhere(node => node.type() === "img" && node.prop("src") === "collapse-image");
    }

    it("shows custom the expand and close icon accordingly", () => {
        const treeView = mount(
            <TreeView
                {...defaultProps}
                {...customIconProps}
                class=""
                items={items}
                isUserDefinedLeafNode={false}
                startExpanded={false}
            />
        );

        // There is not really another way to properly identify that we're dealing with tree view branches.
        const treeViewBranches = treeView.find(".widget-tree-view-branch");
        const firstTreeViewBranchHeader = treeViewBranches.at(0).find("header");

        expect(firstTreeViewBranchHeader).toHaveLength(1);
        expect(firstTreeViewBranchHeader.text()).toContain("First header");

        expect(getExpandIconFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(1);
        expect(getCollapseImageFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(0);

        firstTreeViewBranchHeader.simulate("click");

        const updatedFirstHeader = treeView.find(".widget-tree-view-branch").at(0).find("header");

        expect(getExpandIconFromBranchHeader(updatedFirstHeader)).toHaveLength(0);
        expect(getCollapseImageFromBranchHeader(updatedFirstHeader)).toHaveLength(1);
    });

    it("doesn't show an icon when its child has no nodes", () => {
        const nestedItems: TreeViewProps["items"] = [
            {
                id: "11" as GUID,
                value: "Parent treeview with a nested treeview that is empty",
                content: (
                    <TreeView
                        {...defaultProps}
                        class=""
                        items={[]}
                        isUserDefinedLeafNode={false}
                        startExpanded={false}
                    />
                )
            }
        ];

        const treeView = mount(
            <TreeView
                {...defaultProps}
                {...customIconProps}
                class=""
                items={nestedItems}
                isUserDefinedLeafNode={false}
                startExpanded
            />
        );

        const parentTreeViewHeader = treeView.findWhere(
            node => node.type() === "header" && node.text().includes("Parent treeview")
        );
        expect(parentTreeViewHeader).toHaveLength(1);
        expect(getExpandIconFromBranchHeader(parentTreeViewHeader)).toHaveLength(0);
        expect(getCollapseImageFromBranchHeader(parentTreeViewHeader)).toHaveLength(0);
    });

    it("is clickable and shows an icon when its child has nodes", () => {
        const nestedItems: TreeViewProps["items"] = [
            {
                id: "11" as GUID,
                value: "Parent treeview with a nested treeview that is filled",
                content: (
                    <TreeView
                        {...defaultProps}
                        class=""
                        items={items}
                        isUserDefinedLeafNode={false}
                        startExpanded={false}
                    />
                )
            }
        ];

        const treeView = mount(
            <TreeView
                {...defaultProps}
                {...customIconProps}
                class=""
                items={nestedItems}
                isUserDefinedLeafNode={false}
                startExpanded
            />
        );

        const parentTreeViewHeader = treeView.findWhere(
            node => node.type() === "header" && node.text().includes("Parent treeview")
        );

        expect(parentTreeViewHeader).toHaveLength(1);
        expect(parentTreeViewHeader.getDOMNode().getAttribute("role")).toBe("button");

        expect(getExpandIconFromBranchHeader(parentTreeViewHeader)).toHaveLength(0);
        expect(getCollapseImageFromBranchHeader(parentTreeViewHeader)).toHaveLength(1);
    });

    it("does not influence the parent if it is not immediately in the chain", () => {
        const RandomOtherWidget = ({ children }: { children: ReactNode }): ReactElement => <div>{children}</div>;
        const nestedItems: TreeViewProps["items"] = [
            {
                id: "11" as GUID,
                value: "Parent treeview with a nested treeview that is empty and wrapped with a random other widget",
                content: (
                    <RandomOtherWidget>
                        <TreeView
                            {...defaultProps}
                            class=""
                            items={[]}
                            isUserDefinedLeafNode={false}
                            startExpanded={false}
                        />
                    </RandomOtherWidget>
                )
            }
        ];

        const treeView = mount(
            <TreeView
                {...defaultProps}
                {...customIconProps}
                class=""
                items={nestedItems}
                isUserDefinedLeafNode={false}
                startExpanded
            />
        );

        const parentTreeViewHeader = treeView.findWhere(
            node => node.type() === "header" && node.text().includes("Parent treeview")
        );

        expect(parentTreeViewHeader).toHaveLength(1);
        expect(parentTreeViewHeader.getDOMNode().getAttribute("role")).toBe("button");

        expect(getExpandIconFromBranchHeader(parentTreeViewHeader)).toHaveLength(0);
        expect(getCollapseImageFromBranchHeader(parentTreeViewHeader)).toHaveLength(1);
    });

    // it("is treated as a leaf node even if the user does not specify as a leaf but also dont specify content", () => {
    //     const treeView = mount(
    //         <TreeView
    //             {...defaultProps}
    //             {...customIconProps}
    //             class=""
    //             items={[{ id: "11" as GUID, value: "First header", content: undefined }]}
    //             isUserDefinedLeafNode={false}
    //             startExpanded
    //         />
    //     );

    //     const treeViewHeader = treeView.findWhere(
    //         node => node.type() === "header" && node.text().includes("First header")
    //     );

    //     expect(treeViewHeader).toHaveLength(1);
    //     expect(treeViewHeader.getDOMNode().getAttribute("role")).not.toBe("button");
    // });

    describe("with lazy loading enabled", () => {
        const itemsWithNestedTreeView: TreeViewProps["items"] = [
            {
                id: "11" as GUID,
                value: "Parent treeview with a nested treeview that is filled",
                content: (
                    <TreeView
                        {...defaultProps}
                        class=""
                        items={items}
                        isUserDefinedLeafNode={false}
                        startExpanded={false}
                    />
                )
            }
        ];

        it("starts in the collapsed state", () => {
            const treeView = mount(
                <TreeView
                    {...defaultProps}
                    class=""
                    items={itemsWithNestedTreeView}
                    isUserDefinedLeafNode={false}
                    startExpanded
                    shouldLazyLoad
                />
            );
            const clickableHeader = treeView.find("header").filter("[role='button']");
            expect(clickableHeader).toHaveLength(1);
            expect(treeView.text()).not.toContain("First header");
        });

        it("expands the nested tree view normally", () => {
            const treeView = mount(
                <TreeView
                    {...defaultProps}
                    class=""
                    items={itemsWithNestedTreeView}
                    isUserDefinedLeafNode={false}
                    startExpanded
                    shouldLazyLoad
                />
            );
            const clickableHeader = treeView.find("header").filter("[role='button']");
            expect(clickableHeader).toHaveLength(1);
            expect(treeView.text()).not.toContain("First header");

            clickableHeader.simulate("click");
            expect(treeView.text()).toContain("First header");
        });

        it("collapses the nested treeview through CSS instead of JS after being expanded once", () => {
            const treeView = mount(
                <TreeView
                    {...defaultProps}
                    class=""
                    items={itemsWithNestedTreeView}
                    isUserDefinedLeafNode={false}
                    startExpanded
                    shouldLazyLoad
                />
            );
            const clickableHeader = treeView.find("header").filter("[role='button']");
            expect(clickableHeader).toHaveLength(1);
            expect(treeView.text()).not.toContain("First header");

            clickableHeader.simulate("click");
            expect(treeView.text()).toContain("First header");

            clickableHeader.simulate("click");
            expect(treeView.text()).toContain("First header");
            expect(treeView.find(".widget-tree-view-body").hasClass("widget-tree-view-branch-hidden")).toBe(true);
        });

        function getLoadingSpinnerFromBranchHeader(header: ReactWrapper<any>): ReactWrapper<any> {
            return header.findWhere(node => node.type() === "img" && node.hasClass("widget-tree-view-loading-spinner"));
        }

        it("shows a loading spinner icon when opening for the first time", () => {
            const treeView = mount(
                <TreeView
                    {...defaultProps}
                    {...customIconProps}
                    class=""
                    items={items}
                    isUserDefinedLeafNode={false}
                    startExpanded
                    shouldLazyLoad
                />
            );

            // There is not really another way to properly identify that we're dealing with tree view branches.
            const treeViewBranches = treeView.find(".widget-tree-view-branch");
            const firstTreeViewBranchHeader = treeViewBranches.at(0).find("header");

            expect(firstTreeViewBranchHeader).toHaveLength(1);

            expect(getExpandIconFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(1);
            expect(getCollapseImageFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(0);

            firstTreeViewBranchHeader.simulate("click");

            const updatedFirstHeader = treeView.find(".widget-tree-view-branch").at(0).find("header");
            expect(getExpandIconFromBranchHeader(updatedFirstHeader)).toHaveLength(0);
            expect(getCollapseImageFromBranchHeader(updatedFirstHeader)).toHaveLength(0);
            expect(getLoadingSpinnerFromBranchHeader(updatedFirstHeader)).toHaveLength(1);
        });

        it("the nested treeview should tell the parent it can change from the loading spinner to the next state", () => {
            const treeView = mount(
                <TreeView
                    {...defaultProps}
                    {...customIconProps}
                    class=""
                    items={itemsWithNestedTreeView}
                    isUserDefinedLeafNode={false}
                    startExpanded
                    shouldLazyLoad
                />
            );

            // There is not really another way to properly identify that we're dealing with tree view branches.
            const treeViewBranches = treeView.find(".widget-tree-view-branch");
            const firstTreeViewBranchHeader = treeViewBranches.at(0).find("header");

            expect(firstTreeViewBranchHeader).toHaveLength(1);

            expect(getExpandIconFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(1);
            expect(getCollapseImageFromBranchHeader(firstTreeViewBranchHeader)).toHaveLength(0);

            firstTreeViewBranchHeader.simulate("click");

            const updatedFirstHeader = treeView.find(".widget-tree-view-branch").at(0).find("header");
            expect(getExpandIconFromBranchHeader(updatedFirstHeader)).toHaveLength(0);
            expect(getCollapseImageFromBranchHeader(updatedFirstHeader)).toHaveLength(1);
            expect(getLoadingSpinnerFromBranchHeader(updatedFirstHeader)).toHaveLength(0);
        });
    });

    describe("when interacting through the keyboard", () => {
        beforeEach(() => {
            const treeViewItems = [
                { id: "1" as GUID, value: "First header", content: <div>First content</div> },
                {
                    id: "2" as GUID,
                    value: "Second header",
                    content: (
                        <TreeView
                            {...defaultProps}
                            class=""
                            items={[
                                {
                                    id: "21" as GUID,
                                    value: "Second First header",
                                    content: <div>Second First content</div>
                                },
                                {
                                    id: "22" as GUID,
                                    value: "Second Second header",
                                    content: <div>Second Second content</div>
                                },
                                {
                                    id: "23" as GUID,
                                    value: "Second Third header",
                                    content: <div>Second Third content</div>
                                }
                            ]}
                            isUserDefinedLeafNode={false}
                            startExpanded={false}
                        />
                    )
                },
                {
                    id: "3" as GUID,
                    value: "Third header",
                    content: (
                        <TreeView
                            {...defaultProps}
                            class=""
                            items={[]}
                            isUserDefinedLeafNode={false}
                            startExpanded={false}
                        />
                    )
                },
                {
                    id: "4" as GUID,
                    value: "Fourth header",
                    content: <div>Fourth content</div>
                }
            ];
            render(
                <TreeView
                    {...defaultProps}
                    class=""
                    items={treeViewItems}
                    isUserDefinedLeafNode={false}
                    startExpanded={false}
                />
            );
        });

        function getClickableTreeViewHeaders(): HTMLElement[] {
            return screen.getAllByRole("button").filter(element => element.tagName === "HEADER");
        }

        function focusFirstTreeViewElement(): void {
            expect(document.body).toHaveFocus();
            userEvent.tab();
        }

        it("the Space and Enter keys collapses and expands the tree view branch content", () => {
            expect(screen.queryByText("First content")).not.toBeInTheDocument();

            const treeViewHeaders = getClickableTreeViewHeaders();
            expect(treeViewHeaders).toHaveLength(4);
            treeViewHeaders.forEach(header => {
                expect(header).toHaveAttribute("aria-expanded", "false");
            });

            focusFirstTreeViewElement();

            // expand
            userEvent.keyboard("{Enter}");

            expect(screen.queryByText("First content")).toBeInTheDocument();
            expect(treeViewHeaders[0]).toHaveAttribute("aria-expanded", "true");

            // collapse
            userEvent.keyboard(" ");

            expect(screen.queryByText("First content")).not.toBeInTheDocument();
            expect(treeViewHeaders[0]).toHaveAttribute("aria-expanded", "false");
        });

        it("the Home key jumps focus to the first tree view", () => {
            const treeViewHeaders = getClickableTreeViewHeaders();
            expect(treeViewHeaders).toHaveLength(4);
            treeViewHeaders.forEach(header => {
                expect(header).toHaveAttribute("aria-expanded", "false");
            });

            focusFirstTreeViewElement();

            userEvent.tab();
            userEvent.tab();

            expect(treeViewHeaders[2]).toHaveFocus();

            userEvent.keyboard("{Home}");

            expect(treeViewHeaders[0]).toHaveFocus();
        });

        it("the End key jumps focus to the last tree view", () => {
            const treeViewHeaders = getClickableTreeViewHeaders();
            expect(treeViewHeaders).toHaveLength(4);
            treeViewHeaders.forEach(header => {
                expect(header).toHaveAttribute("aria-expanded", "false");
            });

            focusFirstTreeViewElement();

            expect(treeViewHeaders[0]).toHaveFocus();

            userEvent.keyboard("{End}");

            expect(treeViewHeaders[3]).toHaveFocus();
        });

        describe("the ArrowDown key", () => {
            it("goes to the next tree view element if the current one is collapsed", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                expect(treeViewHeaders[0]).toHaveFocus();

                userEvent.keyboard("{ArrowDown}");

                expect(treeViewHeaders[1]).toHaveFocus();
            });

            it("does not circularly target the first tree view element if the current one is the last", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();
                userEvent.tab();
                userEvent.tab();

                expect(treeViewHeaders[3]).toHaveFocus();

                userEvent.keyboard("{ArrowDown}");

                expect(treeViewHeaders[0]).not.toHaveFocus();
                expect(treeViewHeaders[3]).toHaveFocus();
            });

            it("goes to the next tree view element on the same level if the current one is expanded", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();
                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{Enter}");

                expect(screen.getByText("Second First header")).toBeInTheDocument();
                expect(screen.getByText("Second Second header")).toBeInTheDocument();
                expect(screen.getByText("Second Third header")).toBeInTheDocument();
                expect(getClickableTreeViewHeaders()).toHaveLength(7);
                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");

                expect(treeViewHeaders[1]).toHaveFocus();
                userEvent.keyboard("{ArrowDown}");

                expect(treeViewHeaders[2]).toHaveFocus();
            });
        });

        describe("the ArrowUp key", () => {
            it("goes to the previous tree view element if the current one is collapsed", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{ArrowUp}");

                expect(treeViewHeaders[0]).toHaveFocus();
            });

            it("does not circularly target the last tree view element if the current one is the first", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                expect(treeViewHeaders[0]).toHaveFocus();

                userEvent.keyboard("{ArrowUp}");

                expect(treeViewHeaders[2]).not.toHaveFocus();
                expect(treeViewHeaders[0]).toHaveFocus();
            });

            it("goes to the previous tree view element on the same level even if there are nested elements inbetween", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{Enter}");

                expect(screen.getByText("Second First header")).toBeInTheDocument();
                expect(screen.getByText("Second Second header")).toBeInTheDocument();
                expect(screen.getByText("Second Third header")).toBeInTheDocument();
                expect(getClickableTreeViewHeaders()).toHaveLength(7);
                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.tab();
                userEvent.tab();
                userEvent.tab();
                userEvent.tab();

                expect(treeViewHeaders[2]).toHaveFocus();

                userEvent.keyboard("{Up}");

                expect(treeViewHeaders[1]).toHaveFocus();
            });
        });

        describe("the ArrowRight key", () => {
            it("goes to the next tree view if the current one turns out to be empty", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();
                userEvent.tab();

                expect(treeViewHeaders[2]).toHaveFocus();

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[2]).toHaveAttribute("aria-expanded", "true");

                expect(treeViewHeaders[3]).toHaveFocus();
            });

            it("expands a tree view element if possible", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");
                expect(getClickableTreeViewHeaders()).not.toHaveLength(4);
            });

            it("targets the first child tree view element if the current one is already expanded", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[2]).not.toHaveFocus();
                expect(getClickableTreeViewHeaders()[2]).toHaveFocus();
            });
        });

        describe("the ArrowLeft key", () => {
            it("goes to the previous tree view if the current one is collapsed", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();
                userEvent.tab();

                expect(treeViewHeaders[2]).toHaveFocus();

                userEvent.keyboard("{ArrowLeft}");

                expect(treeViewHeaders[1]).toHaveFocus();
            });

            it("collapses a tree view element if possible", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");
                expect(getClickableTreeViewHeaders()).not.toHaveLength(4);

                userEvent.keyboard("{ArrowLeft}");
                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "false");
                expect(getClickableTreeViewHeaders()).toHaveLength(4);
            });

            it("goes to the parent tree view element if the current one is the first child element", () => {
                const treeViewHeaders = getClickableTreeViewHeaders();
                expect(treeViewHeaders).toHaveLength(4);
                treeViewHeaders.forEach(header => {
                    expect(header).toHaveAttribute("aria-expanded", "false");
                });

                focusFirstTreeViewElement();

                userEvent.tab();

                expect(treeViewHeaders[1]).toHaveFocus();

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[1]).toHaveAttribute("aria-expanded", "true");

                userEvent.keyboard("{ArrowRight}");

                expect(treeViewHeaders[2]).not.toHaveFocus();
                expect(getClickableTreeViewHeaders()[2]).toHaveFocus();

                userEvent.keyboard("{ArrowLeft}");

                expect(treeViewHeaders[1]).toHaveFocus();
            });
        });
    });
});
