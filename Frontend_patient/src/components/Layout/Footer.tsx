import { useTheme } from '../../hooks/useTheme';

export const Footer = () => {
    const { colors } = useTheme();

    return (
        <footer 
            className="border-t mt-auto"
            style={{
                backgroundColor: colors.bg.secondary,
                borderColor: colors.border.default
            }}
        >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p 
                    className="text-center text-sm"
                    style={{ color: colors.text.secondary }}
                >
                    &copy; {new Date().getFullYear()} PlanityClone. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};
