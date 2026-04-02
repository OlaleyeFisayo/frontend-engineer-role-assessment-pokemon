import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { PokemonListItem } from "@/types/pokemon";

import { PokemonCard } from "./index";

// next/image requires a browser environment to render — mock it as a plain img
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    sizes: _sizes,
    ...rest
  }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt as string}
      {...rest}
    />
  ),
}));

// next/link renders an anchor tag in jsdom without needing a router
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      {...rest}
    >
      {children}
    </a>
  ),
}));

const basePokemon: PokemonListItem = {
  id: 1,
  name: "bulbasaur",
  officialArtwork: "https://example.com/official/1.png",
  sprite: "https://example.com/sprite/1.png",
  types: ["grass", "poison"],
  stats: [
    { name: "hp", base_stat: 45 },
    { name: "speed", base_stat: 45 },
  ],
};

describe("PokemonCard", () => {
  it("renders the pokémon name", () => {
    render(<PokemonCard pokemon={basePokemon} />);
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
  });

  it("renders the padded pokédex number", () => {
    render(<PokemonCard pokemon={basePokemon} />);
    expect(screen.getByText("#001")).toBeInTheDocument();
  });

  it("uses officialArtwork as the image src when available", () => {
    render(<PokemonCard pokemon={basePokemon} />);
    const img = screen.getByRole("img", { name: "bulbasaur" });
    expect(img).toHaveAttribute("src", "https://example.com/official/1.png");
  });

  it("falls back to sprite when officialArtwork is null", () => {
    const pokemon: PokemonListItem = { ...basePokemon, officialArtwork: null };
    render(<PokemonCard pokemon={pokemon} />);
    const img = screen.getByRole("img", { name: "bulbasaur" });
    expect(img).toHaveAttribute("src", "https://example.com/sprite/1.png");
  });

  it("falls back to /pokemon-fallback.svg when both images are null", () => {
    const pokemon: PokemonListItem = {
      ...basePokemon,
      officialArtwork: null,
      sprite: null,
    };
    render(<PokemonCard pokemon={pokemon} />);
    const img = screen.getByRole("img", { name: "bulbasaur" });
    expect(img).toHaveAttribute("src", "/pokemon-fallback.svg");
  });

  it("renders a type badge for each type", () => {
    render(<PokemonCard pokemon={basePokemon} />);
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("renders correctly with a single type", () => {
    const pokemon: PokemonListItem = { ...basePokemon, types: ["fire"] };
    render(<PokemonCard pokemon={pokemon} />);
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.queryByText("grass")).not.toBeInTheDocument();
  });

  it("renders an anchor linking to the correct detail page", () => {
    render(<PokemonCard pokemon={basePokemon} />);
    const link = screen.getByRole("link", { name: /bulbasaur/i });
    expect(link).toHaveAttribute("href", "/pokemon/1");
  });
});
