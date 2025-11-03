# Available Fonts Reference

All fonts have been loaded and are ready to use in your Photo Booth app!

## How to Use the Fonts

You can use any of these fonts by setting the `fontFamily` style property:

### In Inline Styles (React)
```tsx
<h1 style={{ fontFamily: 'Graffiti' }}>Text</h1>
```

### In CSS
```css
.my-class {
  font-family: 'Graffiti';
}
```

## Available Fonts

### 1. **Graffiti**
```tsx
fontFamily: 'Graffiti'
```
Urban street-style graffiti font

### 2. **Network**
```tsx
fontFamily: 'Network'
```
Modern network-style font

### 3. **Throwupz**
```tsx
fontFamily: 'Throwupz'
```
Bold graffiti throw-up style font

### 4. **Timegoing**
```tsx
fontFamily: 'Timegoing'
```
Regular time-style font

### 5. **Whoopie Sunday**
```tsx
fontFamily: 'Whoopie Sunday'
```
Playful display font

## Example Usage in Your Components

```tsx
// In Camera.tsx or Selection.tsx
<h1 style={{ 
  fontFamily: 'Graffiti',
  color: 'white',
  fontSize: '48px'
}}>
  Photo Booth
</h1>
```

## Background Image

The NYC street background image is now applied globally to the entire app via `index.css`.

To override it on specific pages, use:
```tsx
<div style={{ 
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  backdropFilter: 'blur(5px)'
}}>
  // Your content with semi-transparent overlay
</div>
```

