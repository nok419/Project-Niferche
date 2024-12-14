// ComingSoonPage.tsx
import { View, Heading, Text } from '@aws-amplify/ui-react';

export const ComingSoonPage = () => {
  return (
    <View
      style={{
        backgroundColor: 'var(--amplify-colors-background-secondary)',
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      <View
        style={{
          backgroundColor: 'var(--amplify-colors-background-primary)',
          padding: '2rem',
          borderRadius: 'var(--amplify-radii-xl)',
          boxShadow: 'var(--amplify-shadows-medium)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <View
          style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}
        >
          🔮
        </View>
        
        <Heading
          level={1}
          style={{
            color: 'var(--amplify-colors-font-primary)',
            fontSize: '2rem',
            marginBottom: '1rem'
          }}
        >
          Coming Soon
        </Heading>
        
        <Text
          style={{
            color: 'var(--amplify-colors-font-secondary)',
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}
        >
          このコンテンツは現在準備中です。
          もうしばらくお待ちください...
        </Text>

        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem'
          }}
        >
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: 'var(--amplify-colors-secondary-60)',
                borderRadius: '50%',
                animation: `bounce ${i * 0.2 + 0.8}s infinite`
              }}
            />
          ))}
        </View>

        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}
        </style>
      </View>
    </View>
  );
};