import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";

const ScrollableCategoryMenu = ({
  categories,
  handleCategoryClick,
  theme,
  styles,
}) => {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className={`${theme} ${styles.appBar}`}
    >
      <Toolbar
        className="overflow-x-auto flex-nowrap min-w-0 w-full scrollbar-hide"
        sx={{
          justifyContent: "flex-start",
          padding: "0 16px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
          gap: "8px",
        }}
      >
        <div className="flex gap-2 py-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              disableRipple
              variant="contained"
              onClick={() => handleCategoryClick(category.name)}
              className={`${theme} ${styles.toolbarButton} whitespace-nowrap`}
              sx={{
                flex: "0 0 auto",
              }}
            >
              {category.name.toUpperCase()}
            </Button>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ScrollableCategoryMenu;
